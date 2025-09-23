import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import type { FastifyInstance } from "fastify";
import { schema } from "../modules/feedParser/schemas/getFeedData.schema";
import { fetchAndSaveFeed } from "../modules/feedParser/services/ feedParser.service";

/**
 * Registers a route to get feed data.
 * @param {FastifyInstance} fastify - The Fastify server instance.
 */
const feedRoute = async (fastify: FastifyInstance) => {
	const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

	route.get(
		"/feed",
		{
			schema: schema,
		},
		async (request, reply) => {
			// enpoint with url and force flag
			const { url = "https://www.reddit.com/.rss", force } = request.query as {
				url: string;
				force?: boolean;
			};

			try {
				// pass Prisma client to keep the service logic separate and make testing easier
				return await fetchAndSaveFeed(fastify.prisma, url, force);
			} catch (error) {
				return reply.status(500).send({ error: error.message });
			}
		},
	);
};

export default feedRoute;
