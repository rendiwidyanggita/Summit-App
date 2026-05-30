import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  if (request.nextUrl.pathname.startsWith("/admin")) {
    response.headers.set("x-summit-admin-protection", "scaffold");
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
