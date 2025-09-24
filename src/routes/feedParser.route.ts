import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { schema } from "../modules/feedParser/schemas/getFeedData.schema";
import { parseFeed } from "../modules/feedParser/services/parseFeed.service";

/**
 * Registers a route to get feed data.
 * @param {FastifyInstance} fastify - The Fastify server instance.
 */
const feedRoute = async (fastify: FastifyInstance) => {
	const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

	route.get(
		"/parse-article",
		{
			schema: schema,
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			// enpoint with url and force flag
			const { url, force } = request.query as { url: string; force?: boolean };
			try {
				const result = await parseFeed(fastify.prisma, url, force);
				return reply.code(200).send({ ...result });
			} catch (error) {
				return reply.status(500).send({ error: (error as Error).message });
			}
		},
	);
};

export default feedRoute;
