// import { getToken } from "next-auth/jwt";
// import { NextRequest, NextResponse } from "next/server";

// export async function middleware(req: NextRequest) {
//   const token = await getToken({ 
//     req, 
//     secret: process.env.NEXTAUTH_SECRET 
//   });
  
//   const { pathname } = req.nextUrl;


//   if (pathname.startsWith("/dashboard")) {

//     if (!token) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }


//     if (pathname.startsWith("/dashboard/admin") && token.role !== "admin") {
//       return NextResponse.redirect(new URL("/", req.url)); 
//     }
//   }

//   return NextResponse.next();
// }


// export const config = {
//   matcher: ["/dashboard/:path*"],
// };
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: "admin-next-auth.session-token",
  });

  const { pathname } = req.nextUrl;

  console.log("🔐 [Proxy]", {
    pathname,
    hasToken: !!token,
    role: token?.role,
  });

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(
        new URL("/login", req.url)
      );
    }

    if (
      pathname.startsWith("/dashboard/admin") &&
      token.role !== "admin"
    ) {
      return NextResponse.redirect(
        new URL("/login", req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};