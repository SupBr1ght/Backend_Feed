import { fetchAndUpdateFeed } from './htmlParser.service'
import { fetchAndSaveFeed } from './ feedParser.service';
import { PrismaClient } from '@prisma/client';

async function parseFeed(prisma: PrismaClient, url: string, force?: boolean) {
    const isRSS = url.endsWith('.rss') || url.includes('/.rss');
    console.log('isRSS', isRSS)

    if (isRSS) {
        // RSS
        return await fetchAndSaveFeed(prisma, url, force);
    } else {
        // Cheerio
        return await fetchAndUpdateFeed(prisma, url);
    }
}

export { parseFeed };