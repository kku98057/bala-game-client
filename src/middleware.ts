import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  // 인증이 필요한 페이지 목록 (로그인한 사용자만 접근 가능)
  const protectedRoutes = ["/balanceGame/create", "/tournamentGame/create"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // 인증이 필요한 페이지에 비로그인 사용자가 접근
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 인증 페이지 목록 (로그인한 사용자는 접근 불가)
  const authRoutes = ["/login", "/signup"];
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // 이미 로그인한 사용자가 로그인/회원가입 페이지 접근 시도
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/game/tournamentGame/create", // 추가
    "/game/balanceGame/create", // 추가
  ],
};
