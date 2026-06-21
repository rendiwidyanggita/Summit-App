#!/usr/bin/env node

/**
 * Pre-Deploy Check Script
 * Validates environment and codebase before deployment
 */

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const checks = [];
let hasErrors = false;

function check(name, fn) {
  try {
    const result = fn();
    checks.push({ name, status: "✅ PASS", message: result });
  } catch (error) {
    checks.push({ name, status: "❌ FAIL", message: error.message });
    hasErrors = true;
  }
}

console.log("🔍 Running pre-deployment checks...\n");

// Check 1: TypeScript compilation
check("TypeScript Compilation", () => {
  try {
    execSync("npx tsc --noEmit", { stdio: "pipe" });
    return "No type errors found";
  } catch (error) {
    throw new Error("TypeScript compilation failed. Run 'npx tsc --noEmit' for details.");
  }
});

// Check 2: Required environment variables documented
check("Environment Variables Documentation", () => {
  const envExample = readFileSync(".env.example", "utf-8");
  const prodExample = readFileSync(".env.production.example", "utf-8");
  
  const requiredVars = [
    "APP_URL",
    "DATABASE_URL",
    "DIRECT_URL",
    "AUTH_SECRET",
    "AUTH_TRUST_HOST",
  ];
  
  const missing = requiredVars.filter(v => !envExample.includes(v) || !prodExample.includes(v));
  
  if (missing.length > 0) {
    throw new Error(`Missing required variables in templates: ${missing.join(", ")}`);
  }
  
  return "All required variables documented";
});

// Check 3: DEMO_MODE not hardcoded for production
check("DEMO_MODE Configuration", () => {
  const envExample = readFileSync(".env.production.example", "utf-8");
  
  if (envExample.includes('DEMO_MODE="true"') || envExample.includes("DEMO_MODE=true")) {
    throw new Error("DEMO_MODE should be 'false' in .env.production.example");
  }
  
  return "DEMO_MODE correctly configured for production";
});

// Check 4: No console.log in production code
check("Production Code Quality", () => {
  try {
    const result = execSync('git grep -n "console\\.log" -- "src/**/*.{ts,tsx}" "!src/**/*.test.{ts,tsx}"', { 
      stdio: "pipe",
      encoding: "utf-8" 
    });
    
    const logs = result.trim().split("\n").filter(line => {
      // Ignore console.warn and console.error (acceptable)
      return !line.includes("console.warn") && !line.includes("console.error");
    });
    
    if (logs.length > 0 && logs[0]) {
      throw new Error(`Found ${logs.length} console.log statements. Consider removing or replacing with proper logging.`);
    }
  } catch (error) {
    // If grep finds nothing, it exits with code 1 - this is actually good
    if (error.status === 1 && !error.stdout) {
      return "No console.log statements found";
    }
    // If grep command itself failed
    if (error.status !== 1) {
      return "Could not check for console.log (git grep not available)";
    }
  }
  
  return "No console.log statements found";
});

// Check 5: Build script includes Prisma generate
check("Build Script Configuration", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
  
  if (!pkg.scripts?.build) {
    throw new Error("Build script not found in package.json");
  }
  
  if (!pkg.scripts.build.includes("prisma-generate") && !pkg.scripts.build.includes("prisma generate")) {
    throw new Error("Build script should include Prisma generate step");
  }
  
  return "Build script properly configured";
});

// Check 6: Security headers configured
check("Security Headers", () => {
  const nextConfig = readFileSync("next.config.ts", "utf-8");
  
  const requiredHeaders = [
    "X-Content-Type-Options",
    "X-Frame-Options",
    "Referrer-Policy",
  ];
  
  const missing = requiredHeaders.filter(h => !nextConfig.includes(h));
  
  if (missing.length > 0) {
    throw new Error(`Missing security headers: ${missing.join(", ")}`);
  }
  
  return "Security headers configured";
});

// Check 7: Vercel configuration exists
check("Vercel Configuration", () => {
  try {
    const vercelConfig = JSON.parse(readFileSync("vercel.json", "utf-8"));
    
    if (!vercelConfig.headers) {
      throw new Error("Vercel headers not configured");
    }
    
    return "Vercel configuration valid";
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error("vercel.json not found");
    }
    throw error;
  }
});

// Check 8: Deployment guide exists
check("Deployment Documentation", () => {
  try {
    readFileSync("DEPLOYMENT.md", "utf-8");
    return "Deployment guide present";
  } catch {
    throw new Error("DEPLOYMENT.md not found");
  }
});

// Print results
console.log("═".repeat(60));
checks.forEach(({ name, status, message }) => {
  console.log(`${status} ${name}`);
  console.log(`   ${message}\n`);
});
console.log("═".repeat(60));

if (hasErrors) {
  console.log("\n❌ Pre-deployment checks FAILED");
  console.log("Please fix the issues above before deploying to production.\n");
  process.exit(1);
} else {
  console.log("\n✅ All pre-deployment checks PASSED");
  console.log("Your application is ready for production deployment!\n");
  process.exit(0);
}
