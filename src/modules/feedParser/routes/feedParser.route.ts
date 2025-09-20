import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import type { FastifyInstance } from "fastify";
import { schema } from "../schemas/getFeedData.schema";

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
			reply.send({ hello: "feed" });
		},
	);
}
