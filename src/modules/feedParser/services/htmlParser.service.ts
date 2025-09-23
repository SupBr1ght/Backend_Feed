import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { getURL } from './getURL.service';
import { PrismaClient } from '@prisma/client';

/**
 * Fetches an RSS feed and saves it to the database.
 * @param {PrismaClient} prisma - The Prisma client instance.
 * @returns {Promise<{link: string, content: string, image: string | null}[]>}
 * A promise that resolves with an array of objects containing the feed link, content, and image properties.
 */
export async function fetchAndSaveFeed(prisma: PrismaClient) {

    const feedLinks = await getURL(prisma) || "urls is not found";
    const feedLink = await Promise.all(
        feedLinks.map(async (feedLink) => {
            try {
                const response = await fetch(feedLink.link);
                const html = await response.text();
                const $ = cheerio.load(html);
                const content = $('div.article-body').text().trim();
                const image = $('img.main-image').attr('src');

                if (!content && !image) return null;

                const existingItem = await prisma.rssFeed.findUnique({
                    where: { link: feedLink.link },
                });

                if (existingItem) {
                    try {
                        await prisma.rssFeed.update({
                            where: { link: feedLink.link },
                            data: {
                                content,
                                image,
                            },
                        });
                    } catch (error) {
                        console.error(error);
                    }
                }

                return {
                    link: feedLink.link,
                    content,
                    image,
                };

            } catch (error) {
                console.error(error);
            }
        }))

    return feedLink;
}
