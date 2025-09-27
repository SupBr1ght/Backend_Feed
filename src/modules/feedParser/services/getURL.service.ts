import type { PrismaClient } from "@prisma/client";

export async function getURL(prisma: PrismaClient) {
    const feedLink = await prisma.rssFeed.findFirst({
        select: { link: true },
    });

    if (feedLink && feedLink.link) {
        const exists = await prisma.rssFeed.findUnique({
            where: { link: feedLink.link },
        });

        if (!exists) {
            await prisma.rssFeed.create({
                data: {
                    link: feedLink.link,
                    title: feedLink.link,
                    content: "",
                },
            });
        }
    }

    return feedLink;
}
