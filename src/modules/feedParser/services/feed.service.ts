import { PrismaClient } from "@prisma/client";
import { parseFeed } from "./ feedParser.service";

export async function processFeeds(prisma: PrismaClient) {
    const sources = await prisma.rssFeed.findMany({
        distinct: ["link"],
        select: { link: true },
    });

    const results: { feedTitle: string; count: number }[] = [];

    for (const src of sources) {
        try {
            const result = await parseFeed(prisma, src.link);
            results.push({
                feedTitle: result.feedTitle ?? "",
                count: result.items.length,
            });
        } catch (err) {
            console.error(`Error parsing ${src.link}:`, err);
        }
    }

    return results;
}
