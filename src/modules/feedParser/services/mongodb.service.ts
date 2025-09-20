import { PrismaClient } from "@prisma/client";

export function fetchAndSaveFeedDB(prisma: PrismaClient) {
	async function findByLink(link: string) {
		return await prisma.rssFeed.findUnique({ where: { link } });
	}

	async function create(data: {
		title: string;
		link: string;
		content: string;
		image?: string | null;
	}) {
		return await prisma.rssFeed.create({ data });
	}

	async function update(
		link: string,
		data: { title: string; content: string; image?: string | null },
	) {
		return await prisma.rssFeed.update({ where: { link }, data });
	}

	return { findByLink, create, update };
}
