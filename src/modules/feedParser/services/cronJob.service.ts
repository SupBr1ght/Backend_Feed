import type { PrismaClient } from "@prisma/client";
import type { FastifyBaseLogger } from "fastify";
import { parseFeed } from "../services/ feedParser.service";

export async function updateFeeds(
	prisma: PrismaClient,
	log: FastifyBaseLogger,
) {
	const sources = await prisma.rssFeed.findMany({
		distinct: ["link"],
		select: { link: true },
	});

	log.info(`Found ${sources.length} unique links`);

	for (const src of sources) {
		try {
			const result = await parseFeed(prisma, src.link);
			log.info(`Parsed: ${result.feedTitle}, items: ${result.items.length}`);
		} catch (err) {
			log.error(`Error parsing ${src.link}: ${err}`);
		}
	}
}
