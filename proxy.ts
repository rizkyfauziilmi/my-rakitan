import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/server/auth/auth";

export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    // redirect to home if user is already authenticated and accessing login or signup page
    if (session && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup")) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/", "/login", "/signup"],
};