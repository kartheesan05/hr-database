import { NextResponse } from "next/server";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";

const protectedRoutes = ["/", "/add-hr", "/edit-hr", "/hr-pitch"];
const loginRoutes = ["/login"];
// const openRoutes = ["/welcome"];
const statsRoutes = ["/stats"];
const adminRoutes = ["/add-user"];

export default async function middleware(req) {
  const path = req.nextUrl.pathname;
  const url = req.nextUrl;
  const googleFlag = url.searchParams.get("google");
  const isProtectedRoute = protectedRoutes.includes(path);
  const isLoginRoute = loginRoutes.includes(path);
  // const isOpenRoute = openRoutes.includes(path);
  const isAdminRoute = adminRoutes.includes(path);
  const isStatsRoute = statsRoutes.includes(path);
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (isProtectedRoute && !session?.email) {
    return NextResponse.redirect(new URL("/welcome", req.nextUrl));
  }

  // Allow /login?google=1 to render so the page can stash localStorage and route away
  if (isLoginRoute && session?.email && googleFlag !== "1") {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (isAdminRoute && session?.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
