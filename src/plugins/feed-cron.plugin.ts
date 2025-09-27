import fp from "fastify-plugin";
import { SimpleIntervalJob, AsyncTask } from "toad-scheduler";
import { PrismaClient } from "@prisma/client";
import { parseFeed } from "../modules/feedParser/services/ feedParser.service";
const prisma = new PrismaClient();

export default fp(async (fastify) => {
    const task = new AsyncTask(
        "parse feeds (cron)",
        async () => {
            fastify.log.info("Running feed parser job (RssFeed)");


            const sources = await prisma.rssFeed.findMany({
                distinct: ["link"],
                select: { link: true },
            });

            fastify.log.info(`Found ${sources.length} unique links`);


            for (const src of sources) {
                try {
                    const result = await parseFeed(prisma, src.link);
                    fastify.log.info(`Parsed: ${result.feedTitle}, items: ${result.items.length}`);
                } catch (err) {
                    fastify.log.error(`Error parsing ${src.link}: ${err}`);
                }
            }
        },
        (err?: Error) => {
            if (err) {
                fastify.log.error({ err }, "Feed job failed");
            }
        }
    );

    const job = new SimpleIntervalJob({ minutes: 30 }, task);

    fastify.ready().then(() => {
        fastify.scheduler.addSimpleIntervalJob(job);
    });

    fastify.addHook("onClose", async () => {
        await prisma.$disconnect();
    });
});
