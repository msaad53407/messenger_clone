"use client";

import { User } from "@prisma/client";

import UserBox from "./UserBox";
import Avatar from "@/app/components/Avatar";
import SettingsModal from "@/app/components/sidebar/SettingsModal";
import { useState } from "react";

interface UserListProps {
	users: User[];
	currentUser?: User;
}

const UserList = ({ users, currentUser }: UserListProps) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<SettingsModal
				currentUser={currentUser!}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
			/>

			<aside
				className="
        fixed 
        inset-y-0 
        pb-20
        lg:pb-0
        lg:left-20 
        lg:w-80 
        lg:block
        overflow-y-auto 
        border-r 
        border-gray-200
        block w-full left-0
      ">
				<div className="px-5">
					<div className="flex items-center justify-between">
						<div
							className="
              text-2xl 
              font-bold 
              text-neutral-800 
              py-4
            ">
							People
						</div>
						<div
							onClick={() => setIsOpen(true)}
							className="cursor-pointer hover:opacity-75 transition">
							<Avatar user={currentUser} />
						</div>
					</div>
					{users.map((user) => (
						<UserBox key={user.id} user={user} />
					))}
				</div>
			</aside>
		</>
	);
};

export default UserList;
