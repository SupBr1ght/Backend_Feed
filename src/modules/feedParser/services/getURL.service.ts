import type { PrismaClient } from "@prisma/client";

export async function getURL(prisma: PrismaClient) {
    const feedLink = await prisma.rssFeed.findFirst({
        select: { link: true },
    });

    if (feedLink && feedLink.link) {
        const exists = await prisma.rssSource.findUnique({
            where: { url: feedLink.link },
        });

        if (!exists) {
            await prisma.rssSource.create({
                data: { url: feedLink.link, active: true },
            });
        }
    }

    return feedLink;
}
