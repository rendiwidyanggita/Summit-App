import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    app: "Summit Gear",
    status: "ok",
    environment: process.env.NODE_ENV ?? "development",
    timestamp: new Date().toISOString(),
  });
}
