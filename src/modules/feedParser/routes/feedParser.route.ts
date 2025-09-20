import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import type { FastifyInstance } from "fastify";
import Parser from "rss-parser";
import { schema } from "../schemas/getFeedData.schema";

/**
 * Registers a route to get feed data.
 * @param {FastifyInstance} fastify - The Fastify server instance.
 */
export async function getFeedDataRoutes(fastify: FastifyInstance) {
	const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

	const parser: Parser = new Parser();

	route.get(
		"/feed",
		{
			schema: schema,
		},
		async (request, reply) => {
			// enpoint with url and force flag
			const { url, force } = request.query as { url: string; force?: boolean };

			if (!url) {
				return reply
					.status(400)
					.send({ error: 'Query param "url" is required' });
			}

			try {
				const feed = await parser.parseURL(url);

				const savedItems = await Promise.all(
					feed.items.map(async (item) => {
						const link = item.link || "";
						if (!link) return null;

						const existing = await fastify.prisma.rssFeed.findUnique({
							where: { link },
						});

						if (!existing) {
							return await fastify.prisma.rssFeed.create({
								data: {
									title: item.title || "",
									link,
									content: item.contentSnippet || item.content || "",
									image: item.enclosure?.url || null,
								},
							});
						} else if (force) {
							return await fastify.prisma.rssFeed.update({
								where: { link },
								data: {
									title: item.title || "",
									content: item.contentSnippet || item.content || "",
									image: item.enclosure?.url || null,
								},
							});
						} else {
							return existing;
						}
					}),
				);

				const filteredItems = savedItems.filter(Boolean);

				return {
					feedTitle: feed.title,
					items: filteredItems,
				};
			} catch (error) {
				return reply.status(500).send({ error: error.message });
			}
		},
	);
}
