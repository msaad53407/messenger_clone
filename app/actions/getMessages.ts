import prisma from "@/app/libs/prismadb";

export default async function getMessages(conversationId: string) {

    try {
        const messages = await prisma.message.findMany({
            where: {
                conversationId
            },
            include: {
                sender: true,
                seen: true,
            },
            orderBy: {
                createdAt: "desc",
            }
        })

        return messages;
    } catch (error: any) {
        return [];
    }
}