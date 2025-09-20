import type { PrismaClient } from "@prisma/client";

export function fetchAndSaveFeedDB(prisma: PrismaClient) {
	async function upsertFeedItem(data: {
		title: string;
		link: string;
		content: string;
		image?: string | null;
	}) {
		return prisma.rssFeed.upsert({
			where: { link: data.link },
			update: {
				title: data.title,
				content: data.content,
				image: data.image ?? null,
			},
			create: {
				title: data.title,
				link: data.link,
				content: data.content,
				image: data.image ?? null,
			},
		});
	}
	return { upsertFeedItem };
}
