import { spawnSync } from "node:child_process";

process.env.DATABASE_URL ??= "postgresql://postgres:postgres@localhost:5432/summit_gear?schema=public";
process.env.DIRECT_URL ??= process.env.DATABASE_URL;

const command = process.platform === "win32" ? "node_modules\\.bin\\prisma.cmd" : "node_modules/.bin/prisma";
const result = spawnSync(command, ["generate", "--schema", "prisma/schema.prisma"], {
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32",
});

if (result.error) {
  console.error(result.error);
}

process.exit(result.status ?? 1);
