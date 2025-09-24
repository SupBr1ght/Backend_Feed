import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { PrismaClient } from '@prisma/client';

export async function fetchAndUpdateFeed(
    prisma: PrismaClient,
    url: string,
) {
    try {
        console.log('Processing URL:', url);

        const $ = await cheerio.fromURL(url);

        const content: string[] = [];


        /**
         * Finds the article div and extracts the text content.
         * The article div is expected to have a class of "publication-text".
         * If the div is found, its text content is added to the content array.
         */
        const articleDiv = $('.publication-text');
        if (articleDiv.length > 0) {
            // Extract the text content of the article div
            content.push(articleDiv.text().trim());
        }


        // first try to find the first <h1>; if not found, fall back to the meta tag og:title;
        const title = $('h1').first().text().trim() || $('meta[property="og:title"]').attr('content') || url;

        // first check the og:image meta tag; if not found, take the first <img> inside the article container;
        const image = $('meta[property="og:image"]').attr('content') ||
            articleDiv.find('img').first().attr('src') || null;

        // Join all content paragraphs into a single string with double newlines between paragraphs
        const contentJoined = content.join('\n\n');



        if (!content && !image) {
            console.log('No content or image found for url:', url);
            return null;
        }


        const saved = await prisma.rssFeed.upsert({
            where: { link: url },
            create: {
                title,
                link: url,
                content: contentJoined,
                image: image || null,
            },
            update: {
                content: contentJoined,
                image: image || null,
            },
        });

        return {
            feedTitle: title,
            items: [
                {
                    title,
                    link: url,
                    content: contentJoined,
                    image: image || null,
                },
            ],
        };

    } catch (error) {
        console.error('Error processing url:', url, error);
        return null;
    }


}
