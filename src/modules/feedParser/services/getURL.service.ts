import type { PrismaClient } from "@prisma/client";

export async function getURL(prisma: PrismaClient) {
    const feedLink = await prisma.rssFeed.findFirst({
        select: {
            link: true
        }
    })
    return feedLink;
}