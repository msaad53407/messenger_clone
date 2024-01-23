"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { FullMessageType } from "@/app/types";

import Avatar from "@/app/components/Avatar";
import ImageModal from "./ImageModal";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import ConfirmModal from "./ConfirmModal";

interface MessageBoxProps {
	data: FullMessageType;
	isLast?: boolean;
}

const MessageBox = ({ data, isLast }: MessageBoxProps) => {
	const session = useSession();
	const [imageModalOpen, setImageModalOpen] = useState(false);
	const [confirmModalOpen, setConfirmModalOpen] = useState(false);

	const isOwn = session.data?.user?.email === data?.sender?.email;
	const seenList = (data.seen || [])
		.filter((user) => user.email !== data?.sender?.email)
		.map((user) => user.name)
		.join(", ");

	const container = clsx("flex gap-3 p-4", isOwn && "justify-end");
	const avatar = clsx(isOwn && "order-2");
	const body = clsx("flex flex-col gap-2", isOwn && "items-end");
	const message = clsx(
		"text-sm w-fit overflow-hidden",
		isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
		data.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
	);

	return (
		<>
			<ConfirmModal
				type={"MESSAGE"}
				messageId={data.id}
				isOpen={confirmModalOpen}
				onClose={() => setConfirmModalOpen(false)}
			/>
			<div className={container}>
				<div className={avatar}>
					<Avatar user={data.sender} />
				</div>
				<div className={body}>
					<div className="flex items-center gap-4">
						<div className="text-sm text-gray-500">{data.sender.name}</div>
						<div className="text-xs text-gray-400">
							{format(new Date(data.createdAt), "p")}
						</div>
						{session.data?.user?.email === data.sender.email ? (
							<HiEllipsisHorizontal
								size={22}
								onClick={() => setConfirmModalOpen(true)}
								className={clsx(
									"text-sky-500 cursor-pointer hover:text-sky-600 transition-all",
									isOwn && "order-first"
								)}
							/>
						) : null}
					</div>
					<div className={message}>
						<ImageModal
							src={data.image}
							isOpen={imageModalOpen}
							onClose={() => setImageModalOpen(false)}
						/>
						{data.image ? (
							<Image
								alt="Image"
								height="288"
								width="288"
								onClick={() => setImageModalOpen(true)}
								src={data.image}
								className="
                            object-cover 
                            cursor-pointer 
                            hover:scale-110 
                            transition 
                            translate
                        "
							/>
						) : (
							<div>{data.body}</div>
						)}
					</div>
					{isLast && isOwn && seenList.length > 0 && (
						<div
							className="
            text-xs 
            font-light 
            text-gray-500
            ">
							{`Seen by ${seenList}`}
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default MessageBox;
