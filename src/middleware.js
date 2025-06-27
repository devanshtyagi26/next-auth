import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

export async function middleware(request) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Allow access to static files and public paths
  const isAuthPage = ["/", "/sign-in", "/sign-up", "/verify"].some((path) =>
    pathname.startsWith(path)
  );

  if (token) {
    // If authenticated and trying to access public routes → redirect to dashboard
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    // Else, let them access normally
    return NextResponse.next();
  } else {
    // If NOT authenticated and trying to access protected route
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    // Else allow (e.g., accessing `/home`)
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/", "/sign-in", "/sign-up", "/verify/:path*", "/dashboard/:path*"],
};
