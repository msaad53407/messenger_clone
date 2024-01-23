import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
	messageId?: string;
}

export async function DELETE(
	request: Request,
	{ params }: { params: IParams }
) {
	try {
		const body = await request.json();
		const { conversationId } = body;
		const { messageId } = params;
		const currentUser = await getCurrentUser();

		if (!currentUser?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const existingMessage = await prisma.message.findUnique({
			where: {
				id: messageId,
			},
			include: {
				conversation: true,
			},
		});

		if (!existingMessage) {
			return new NextResponse("Invalid ID", { status: 400 });
		}

		if (existingMessage.senderId !== currentUser.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		try {
			const deletedMessage = await prisma.message.delete({
				where: {
					id: messageId,
				},
			});

			const updatedConversation = await prisma.conversation.update({
				where: {
					id: conversationId,
				},
				data: {
					lastMessageAt: new Date(),
					messages: {
						disconnect: {
							id: messageId,
						},
					},
				},
				include: {
					users: true,
					messages: {
						include: {
							seen: true,
						},
					},
				},
			});

			await pusherServer.trigger(
				conversationId,
				"message:remove",
				deletedMessage
			);

			updatedConversation.users.map((user) => {
				pusherServer.trigger(user.email!, "conversation:update", {
					id: conversationId,
					messages: [updatedConversation.messages],
				});
			});

			return NextResponse.json(deletedMessage);
		} catch (error: any) {
			console.log(error);
			await pusherServer.trigger(conversationId, "message:remove", messageId);
		}

		return new NextResponse("Message Deleted", { status: 200 });
	} catch (error: any) {
		console.log(error.message);
		return new NextResponse("Internal Server Error " + error.message, {
			status: 500,
		});
	}
}
