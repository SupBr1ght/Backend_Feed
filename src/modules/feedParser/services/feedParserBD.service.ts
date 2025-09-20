import type { PrismaClient } from "@prisma/client";

export function createRssFeedDB(prisma: PrismaClient) {
	/**
	 * Finds an RSS feed item by its link.
	 * @param {string} link - The link of the RSS feed item to find.
	 * @returns {Promise<RssFeed>} - A promise that resolves with the found RSS feed item, or null if not found.
	 */
	async function findByLink(link: string) {
		return prisma.rssFeed.findUnique({ where: { link } });
	}

	/**
	 * Upsert - Upserts an RSS feed item. If the item already exists in the database,
	 * it will be updated with the provided data. If it does not exist, it will be created
	 * with the provided data.
	 * @param {string} link - The link of the RSS feed item to upsert.
	 * @param {object} data - The data of the RSS feed item to upsert. It must contain the
	 * title, content, and optionally an image.
	 * @returns {Promise<RssFeed>} - A promise that resolves with the upserted RSS feed item.
	 */
	async function upsert(
		link: string,
		data: { title: string; content: string; image?: string | null },
	) {
		const existing = await findByLink(link);
		if (existing) {
			return prisma.rssFeed.update({ where: { link }, data });
		}
		return prisma.rssFeed.create({ data: { ...data, link } });
	}

	return { findByLink, upsert };
}
