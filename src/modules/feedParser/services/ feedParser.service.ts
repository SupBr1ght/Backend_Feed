import Parser from "rss-parser";
import type { PrismaClient } from "@prisma/client";
import { fetchAndSaveFeedDB } from "./mongodb.service";
const parser = new Parser();

/**
 * Fetches and saves an RSS feed to the database.
 *
 * @param {PrismaClient} prisma - The Prisma client instance.
 * @param {string} url - The URL of the RSS feed.
 * @param {boolean} [force=false] - If true, forces a refresh of the feed by deleting and re-creating the item in the database.
 * @returns {Promise<{feedTitle: string, items: {title: string, link: string, content: string, image: string | null}[]}>}
 * A promise that resolves with an object containing the feed title and an array of saved items. The items array contains objects with title, link, content, and image properties.

 */
export async function fetchAndSaveFeed(
	prisma: PrismaClient,
	url: string,
	force: boolean = false,
) {
	const feed = await parser.parseURL(url);
	const db = fetchAndSaveFeedDB(prisma);
	const savedItems = await Promise.all(
		// optimize mapping with Promise.all and async/await
		feed.items.map(async (item) => {
			const link = item.link;
			if (!link) return null;
			// check if the record with this link already exists
			try {
				return await db.upsertFeedItem({
					title: item.title || "",
					link: item.link || "",
					content: item.contentSnippet || item.content || "",
					image: item.enclosure?.url || null,
				});
			} catch (error) {
				console.error(error);
				return null;
			}
		}),
	);

	return {
		feedTitle: feed.title,
		items: savedItems.filter(Boolean),
		force,
	};
}
