import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { HiArrowLeftOnRectangle, HiUsers } from "react-icons/hi2";
import { HiChat } from "react-icons/hi";
import { signOut } from "next-auth/react";
import useConversation from "./useConversation";
import toast from "react-hot-toast";

const useRoutes = () => {
	const pathname = usePathname();
	const { conversationId } = useConversation();

	const routes = useMemo(
		() => [
			{
				label: "Chat",
				href: "/conversations",
				icon: HiChat,
				active: pathname === "/conversations" || !!conversationId,
			},
			{
				label: "Users",
				href: "/users",
				icon: HiUsers,
				active: pathname === "/users",
			},
			{
				label: "Logout",
				onClick: () =>
					toast.promise(signOut(), {
						loading: "Signing out...",
						success: "Signed out!",
						error: "Failed to Signed out",
					}),
				href: "#",
				icon: HiArrowLeftOnRectangle,
			},
		],
		[pathname, conversationId]
	);

	return routes;
};

export default useRoutes;
