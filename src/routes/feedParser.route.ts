import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { parseFeed } from "../modules/feedParser/services/ feedParser.service";

interface ParseArticleQuery {
	url: string;
	force?: boolean;
}

const feedRoute = async (fastify: FastifyInstance) => {
	fastify.get("/parse-article", async (request: FastifyRequest<{ Querystring: ParseArticleQuery }>, reply: FastifyReply) => {
		const { url, force } = request.query;

		if (!url) {
			return reply.status(400).send({ error: "URL не передано" });
		}

		try {
			const result = await parseFeed(fastify.prisma, url, force);
			return reply.code(200).send(result);
		} catch (error) {
			console.error("Error in /parse-article:", error);
			return reply.status(500).send({ error: (error as Error).message });
		}
	});
};

export default feedRoute;
