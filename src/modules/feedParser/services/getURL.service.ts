import type { PrismaClient } from "@prisma/client";

export async function getURL(prisma: PrismaClient) {
    const feedLink = await prisma.rssFeed.findMany({
        select: {
            link: true
        }
    })
    return feedLink;
}