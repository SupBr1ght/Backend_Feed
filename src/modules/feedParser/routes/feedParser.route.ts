import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import type { FastifyInstance } from "fastify";
import { schema } from "../schemas/getFeedData.schema";
import { fetchAndSaveFeed } from "../services/ feedParser.service";

/**
 * Registers a route to get feed data.
 * @param {FastifyInstance} fastify - The Fastify server instance.
 */
export async function getFeedDataRoutes(fastify: FastifyInstance) {
	const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

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
				// pass Prisma client to keep the service logic separate and make testing easier
				return await fetchAndSaveFeed(fastify.prisma, url, force);
			} catch (error) {
				return reply.status(500).send({ error: error.message });
			}
		},
	);
}
