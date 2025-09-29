import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { schema } from "../modules/feedParser/schemas/getFeedData.schema";
import { parseFeed } from "../modules/feedParser/services/ feedParser.service";

const feedRoute = async (fastify: FastifyInstance) => {
	fastify
		.withTypeProvider<JsonSchemaToTsProvider>()
		.get(
			"/parse-article",
			{ schema: schema },
			async (request: FastifyRequest, reply: FastifyReply) => {
				const { url, force } = request.query as {
					url: string;
					force: boolean;
				};

				if (!url) {
					return reply.status(400).send({ error: "URL is required" });
				}

				try {
					const result = await parseFeed(fastify.prisma, url, force);
					return reply.code(200).send(result);
				} catch (error) {
					request.log.error("Error in /parse-article:", error);
					return reply.status(500).send({ error: error.message });
				}
			},
		);
};

export default feedRoute;
