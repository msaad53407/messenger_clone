import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prisma from "@/app/libs/prismadb";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
		GithubProvider({
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
		}),
		CredentialsProvider({
			name: "Credentials",
			type: "credentials",
			credentials: {
				email: {
					label: "Email",
					type: "text",
				},
				password: {
					label: "Password",
					type: "password",
				},
			},
			authorize: async (credentials, req) => {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Email and password are required");
				}

				const user = await prisma.user.findUnique({
					where: {
						email: credentials.email,
					},
				});
				if (user && user.hashedPassword) {
					const isMatch = await bcrypt.compare(
						credentials.password,
						user.hashedPassword
					);
					if (isMatch) {
						return user;
					}
					throw new Error("Invalid password");
				}
				throw new Error("Incorrect credentials");
			},
		}),
	],

	debug: process.env.NODE_ENV === "development",
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
};
