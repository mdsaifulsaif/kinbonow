import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  const { pathname } = req.nextUrl;


  if (pathname.startsWith("/dashboard")) {

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }


    if (pathname.startsWith("/dashboard/admin") && token.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url)); 
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/dashboard/:path*"],
};