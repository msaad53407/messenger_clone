import getConversations from "../actions/getConversations";
import getUsers from "../actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conversations - Messenger",
  description:
    "Messenger is an Application to chat with your friends in realtime. Never stay away from your loved ones.",
};

export default async function ConversationsLayout({
    children
}: {
    children: React.ReactNode,
}) {
    const conversations = await getConversations();
    const users = await getUsers();

    return (
        <Sidebar>   
            <div className="h-full">
                <ConversationList
                    users={users}
                    title="Messages"
                    initialItems={conversations}
                />
                {children}
            </div>
        </Sidebar>
    );
}