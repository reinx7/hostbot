import { NextResponse, type NextRequest } from "next/server";
const headers = { "X-Frame-Options": "DENY", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin", "Permissions-Policy": "camera=(), microphone=(), geolocation=()" };
export function middleware(req: NextRequest) { const res = NextResponse.next(); Object.entries(headers).forEach(([k,v])=>res.headers.set(k,v)); return res; }
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
