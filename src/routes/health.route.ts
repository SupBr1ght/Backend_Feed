import { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
    fastify.get("/health", async () => {
        return { status: "ok" };
    });

    fastify.get("/db-health", async () => {
        try {
            const feeds = await fastify.prisma.rssFeed.findMany({ take: 1 });
            return {
                ok: true,
                count: feeds.length,
            };
        } catch (err) {
            return {
                ok: false,
                error: (err as Error).message,
            };
        }
    });
}
