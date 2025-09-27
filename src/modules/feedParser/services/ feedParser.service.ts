import Parser from "rss-parser";
import { PrismaClient } from "@prisma/client";
import { fetchAndSaveFeedDB } from "./mongodb.service";
import * as cheerio from "cheerio";

const parser = new Parser();

async function parseHTML(prisma: PrismaClient, url: string) {
	try {
		const res = await fetch(url);
		const html = await res.text();
		const $ = cheerio.load(html);


		const title = $("h1").first().text().trim() || $("meta[property='og:title']").attr("content") || url;


		const image = $("meta[property='og:image']").attr("content") || $("img").first().attr("src") || null;

		const paragraphs = $("p").map((i, el) => $(el).text().trim()).get();
		const content = paragraphs.join("\n\n");

		const saved = await fetchAndSaveFeedDB(prisma).upsertFeedItem({
			title,
			link: url,
			content,
			image,
		});

		return {
			id: saved.id,
			title,
			link: url,
			content,
			image,
		};
	} catch (err) {
		return null;
	}
}

export async function parseFeed(prisma: PrismaClient, url: string, force?: boolean) {
	const isRSS = url.includes("/feed/") || url.endsWith(".rss");

	if (isRSS) {
		const feed = await parser.parseURL(url);
		const links = feed.items.map(item => item.link).filter(Boolean) as string[];

		const fullArticles = await Promise.all(
			links.map(link => parseHTML(prisma, link))
		);

		return {
			feedTitle: feed.title,
			items: fullArticles.filter(Boolean),
		};
	} else {
		const article = await parseHTML(prisma, url);
		return {
			feedTitle: article?.title || url,
			items: article ? [article] : [],
		};
	}
}

export async function processAllFeeds(prisma: PrismaClient) {
	const sources = await prisma.rssSource.findMany({
		where: { active: true },
		select: { id: true, url: true },
	});

	const results: { feedTitle: string; count: number }[] = [];

	for (const src of sources) {
		const result = await parseFeed(prisma, src.url);
		results.push({ feedTitle: result.feedTitle ?? '', count: result.items.length });
	}

	return results;
}