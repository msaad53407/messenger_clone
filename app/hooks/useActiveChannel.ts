import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { pusherClient } from "../libs/pusher";
import { Channel, Members } from "pusher-js";
import useActiveList from "./useActiveList";

const useActiveChannel = () => {
	const { set, add, remove, members } = useActiveList();
	const session = useSession();
	const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

	useEffect(() => {
		let channel = activeChannel;

		if (!channel && session.data?.user?.email) {
			channel = pusherClient.subscribe("presence-messenger");
			setActiveChannel(channel);
		}

		if (session.data?.user?.email && channel) {
			channel.bind("pusher:subscription_succeeded", (members: Members) => {
				const initialMembers: string[] = [];

				members.each((member: Record<string, any>) =>
					initialMembers.push(member.id)
				);
				set(initialMembers);
			});

			channel.bind("pusher:member_added", (member: Record<string, any>) => {
				add(member.id);
			});

			channel?.bind("pusher:member_removed", (member: Record<string, any>) => {
				remove(member.id);
			});
		}

		return () => {
			if (activeChannel) {
				pusherClient.unsubscribe("presence-messenger");
				setActiveChannel(null);
			}
		};
	}, [activeChannel, set, add, remove, session.data?.user?.email]);
};

export default useActiveChannel;
