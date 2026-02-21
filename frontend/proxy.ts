import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ADMIN_TOKEN_KEY } from "./lib/admin-auth";

function hasAdminToken(request: NextRequest): boolean {
  return Boolean(request.cookies.get(ADMIN_TOKEN_KEY)?.value);
}

function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const authed = hasAdminToken(request);

  if (!authed && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (authed && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export { proxy };
export default proxy;

export const config = {
  matcher: ["/admin/:path*"],
};
