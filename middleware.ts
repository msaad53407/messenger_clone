import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { type NextRequest, NextResponse } from "next/server";

export default withAuth(
	async function middleware(req: NextRequest) {
		const token = await getToken({ req });

		const isAuthenticated = !!token;
		console.log(req.url);
		if (!isAuthenticated) {
			return NextResponse.redirect(new URL("/", req.url));
		} else if (isAuthenticated) {
			if (req.nextUrl.pathname === "/") {
				return NextResponse.redirect(new URL("/users", req.url));
			}
			return NextResponse.next();
		}

		return NextResponse.next();
	},
	{
		pages: {
			signIn: "/",
		},
	}
);

export const config = {
	matcher: ["/", "/users/:path*", "/conversations/:path*"],
};
