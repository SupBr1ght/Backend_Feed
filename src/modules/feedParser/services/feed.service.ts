import { PrismaClient } from "@prisma/client";
import { parseFeed } from "./ feedParser.service";

export class FeedService {
    constructor(private prisma: PrismaClient) { }

    async processFeeds() {
        const sources = await this.prisma.rssSource.findMany({
            where: { active: true },
            select: { id: true, url: true },
        });

        const results: { sourceId: string; feedTitle: string; count: number }[] = [];

        for (const src of sources) {
            try {
                const result = await parseFeed(this.prisma, src.url);
                results.push({ sourceId: src.id, feedTitle: result.feedTitle ?? '', count: result.items.length });
            } catch (err) {
                console.error(`Error parsing ${src.url}:`, err);
            }
        }

        return results;
    }
}
