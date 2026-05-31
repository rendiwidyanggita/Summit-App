import { spawn } from "node:child_process";
import { execFileSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import "dotenv/config";
import pg from "pg";

const port = Number(process.env.VERIFY_PORT ?? 3101);
const baseUrl = `http://localhost:${port}`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer() {
  for (let i = 0; i < 30; i += 1) {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch {
      // wait
    }

    await sleep(1000);
  }

  throw new Error("Server did not become ready.");
}

async function request(method, path, body) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    redirect: "manual",
    signal: controller.signal,
  });
  clearTimeout(timeout);
  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  return {
    route: path,
    status: response.status,
    length: text.length,
    json,
  };
}

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

async function withDb(callback) {
  const client = new pg.Client({
    connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  try {
    return await callback(client);
  } finally {
    await client.end();
  }
}

async function insertToken(table, userId, rawToken) {
  await withDb((client) =>
    client.query(
      `insert into "${table}" ("id", "userId", "tokenHash", "expiresAt") values ($1, $2, $3, $4)`,
      [randomUUID(), userId, hashToken(rawToken), new Date(Date.now() + 60 * 60 * 1000)],
    ),
  );
}

async function cleanupTestUsers() {
  await withDb((client) =>
    client.query(
      `delete from "User" where "email" like $1 or "email" like $2`,
      ["sprint2-test-%@example.com", "debug-sprint2-%@example.com"],
    ),
  );
}

const nextCli = "node_modules/next/dist/bin/next";
const server = spawn(process.execPath, [nextCli, "start", "-p", String(port)], {
  cwd: process.cwd(),
  env: process.env,
  stdio: ["ignore", "pipe", "pipe"],
});

const logs = [];
server.stdout.on("data", (chunk) => logs.push(chunk.toString()));
server.stderr.on("data", (chunk) => logs.push(chunk.toString()));

try {
  await cleanupTestUsers();
  await waitForServer();

  const email = `sprint2-test-${crypto.randomUUID().replaceAll("-", "")}@example.com`;
  const checks = [];

  checks.push(await request("GET", "/api/health"));
  checks.push(await request("GET", "/api/products"));
  checks.push(await request("GET", "/api/categories"));
  checks.push(await request("GET", "/api/banners"));
  checks.push(await request("GET", "/api/account/profile"));
  checks.push(await request("GET", "/api/account/addresses"));
  checks.push(await request("GET", "/api/admin/summary"));
  // Sprint 3 catalog coverage
  checks.push(await request("GET", "/api/products?sort=newest"));
  checks.push(await request("GET", "/api/products?sort=best_selling&pageSize=5"));
  checks.push(await request("GET", "/api/products?sort=rating_desc&minRating=4.5"));
  checks.push(await request("GET", "/api/products?discountOnly=1&inStockOnly=1"));
  checks.push(await request("GET", "/api/products?category=tenda&brand=summit-gear"));
  checks.push(await request("GET", "/api/products/summit-ridge-tent-2p"));
  checks.push(await request("GET", "/api/products/summit-ridge-tent-2p/related"));
  checks.push(await request("GET", "/api/products/suggest?q=ten"));
  checks.push(await request("GET", "/api/products/suggest?q="));
  checks.push(await request("GET", "/api/home-feed"));
  checks.push(await request("GET", "/api/gear-checklists"));
  checks.push(await request("GET", "/api/gear-checklists/pendakian-gunung"));
  checks.push(await request("GET", "/api/gear-checklists/non-existent"));
  const register = await request("POST", "/api/auth/register", {
      name: "Sprint Two Tester",
      email,
      phone: "081234567890",
      password: "Password123!",
      confirmPassword: "Password123!",
    });
  checks.push(register);
  checks.push(await request("POST", "/api/auth/forgot-password", { email }));
  checks.push(await request("POST", "/api/auth/forgot-password", { email: "missing@example.com" }));
  checks.push(await request("POST", "/api/auth/resend-verification", { email }));
  checks.push(
    await request("POST", "/api/auth/verify-email", {
      token: "invalid-token-invalid-token-invalid-token-invalid-token",
    }),
  );
  checks.push(
    await request("POST", "/api/auth/reset-password", {
      token: "invalid-token-invalid-token-invalid-token-invalid-token",
      password: "Password456!",
      confirmPassword: "Password456!",
    }),
  );

  const userId = register.json?.data?.id;

  if (userId) {
    const verificationToken = `verify-${randomUUID()}-${randomUUID()}`;
    await insertToken("EmailVerificationToken", userId, verificationToken);
    checks.push(await request("POST", "/api/auth/verify-email", { token: verificationToken }));
    checks.push(await request("POST", "/api/auth/verify-email", { token: verificationToken }));

    const resetToken = `reset-${randomUUID()}-${randomUUID()}`;
    await insertToken("PasswordResetToken", userId, resetToken);
    checks.push(
      await request("POST", "/api/auth/reset-password", {
        token: resetToken,
        password: "Password456!",
        confirmPassword: "Password456!",
      }),
    );
    checks.push(
      await request("POST", "/api/auth/reset-password", {
        token: resetToken,
        password: "Password789!",
        confirmPassword: "Password789!",
      }),
    );
  }

  console.table(checks.map(({ route, status, length }) => ({ route, status, length })));
  const failed = checks.filter((check) => check.status >= 500);
  if (failed.length > 0) {
    console.error(logs.join(""));
    process.exitCode = 1;
  }
} catch (error) {
  console.error(error);
  console.error(logs.join(""));
  process.exitCode = 1;
} finally {
  try {
    await cleanupTestUsers();
  } catch {
    // best effort cleanup
  }

  if (process.platform === "win32" && server.pid) {
    try {
      execFileSync("taskkill", ["/PID", String(server.pid), "/T", "/F"], { stdio: "ignore" });
    } catch {
      server.kill("SIGTERM");
    }
  } else {
    server.kill("SIGTERM");
  }
  await sleep(1000);

  if (!server.killed) {
    server.kill("SIGKILL");
  }
}
