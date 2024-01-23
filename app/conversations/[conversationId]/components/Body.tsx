"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";

import { pusherClient } from "@/app/libs/pusher";
import useConversation from "@/app/hooks/useConversation";
import MessageBox from "./MessageBox";
import { FullMessageType } from "@/app/types";

interface BodyProps {
	initialMessages: FullMessageType[];
}

const Body = ({ initialMessages = [] }: BodyProps) => {
	const bottomRef = useRef<HTMLDivElement>(null);
	const [messages, setMessages] = useState(initialMessages);

	const { conversationId } = useConversation();

	useEffect(() => {
		axios.post(`/api/conversations/${conversationId}/seen`);
	}, [conversationId]);

	useEffect(() => {
		pusherClient.subscribe(conversationId);
		bottomRef?.current?.scrollIntoView({ behavior: "smooth" });

		const messageHandler = (message: FullMessageType) => {
			axios.post(`/api/conversations/${conversationId}/seen`);

			setMessages((current) => {
				if (
					current.find((currentMessage) => currentMessage.id === message.id)
				) {
					return current;
				}

				return [...current, message];
			});

			bottomRef?.current?.scrollIntoView();
		};

		const updateMessageHandler = (newMessage: FullMessageType) => {
			setMessages((current) =>
				current.map((currentMessage) => {
					if (currentMessage.id === newMessage.id) {
						return newMessage;
					}

					return currentMessage;
				})
			);
			bottomRef?.current?.scrollIntoView();
		};

		function deleteMessageHandler(
			deletedMessageOrId: FullMessageType | string | undefined
		) {
			if (typeof deletedMessageOrId === "string") {
				setMessages((current) =>
					current.filter((message) => message.id !== deletedMessageOrId)
				);
			} else if (typeof deletedMessageOrId !== "string" && deletedMessageOrId) {
				setMessages((current) =>
					current.filter((message) => message.id !== deletedMessageOrId.id)
				);
			} else {
				setMessages(messages);
			}
		}
		// console.log(messages, deletedMessage);

		pusherClient.bind("messages:new", messageHandler);
		pusherClient.bind("message:update", updateMessageHandler);
		pusherClient.bind("message:remove", deleteMessageHandler);

		return () => {
			pusherClient.unsubscribe(conversationId);
			pusherClient.unbind("messages:new", messageHandler);
			pusherClient.unbind("message:update", updateMessageHandler);
			pusherClient.unbind("message:remove", deleteMessageHandler);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [conversationId]);

	return (
		<div className="flex-1 overflow-y-auto">
			{messages.map((message, i) => (
				<MessageBox
					isLast={i === messages.length - 1}
					key={message.id}
					data={message}
				/>
			))}
			<div className="pt-24" ref={bottomRef} />
		</div>
	);
};

export default Body;
