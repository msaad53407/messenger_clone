import { NextResponse } from "next/server";
import getCurrentUser from "../actions/getCurrentUser";
import getUsers from "../actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar";
import UserList from "./components/UserList";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Users - Messenger",
	description:
		"Messenger is an Application to chat with your friends in realtime. Never stay away from your loved ones.",
};

export default async function UsersLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const currentUser = await getCurrentUser();
	const users = await getUsers();

	if (currentUser) {
		return (
			<Sidebar>
				<div className="h-full">
					<UserList users={users} currentUser={currentUser} />
					{children}
				</div>
			</Sidebar>
		);
	}

	return (
		<Sidebar>
			<div className="h-full">
				<UserList users={users} />
				{children}
			</div>
		</Sidebar>
	);
}
