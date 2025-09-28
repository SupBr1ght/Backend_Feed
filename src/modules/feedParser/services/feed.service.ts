import { PrismaClient } from "@prisma/client";
import { parseFeed } from "./ feedParser.service";

export class FeedService {
    constructor(private prisma: PrismaClient) { }

    async processFeeds() {

        const sources = await this.prisma.rssFeed.findMany({
            distinct: ["link"],
            select: { link: true },
        });

        const results: { feedTitle: string; count: number }[] = [];


        for (const src of sources) {
            try {
                const result = await parseFeed(this.prisma, src.link);
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
}
