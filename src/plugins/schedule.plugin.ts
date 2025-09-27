import fp from "fastify-plugin";
import { SimpleIntervalJob, AsyncTask } from "toad-scheduler";
import { PrismaClient } from "@prisma/client";
import { processAllFeeds } from "../modules/feedParser/services/feedParser.service";

const prisma = new PrismaClient();

export default fp(async (fastify) => {
    const task = new AsyncTask(
        "parse feeds (cron)",
        async () => {
            fastify.log.info("🚀 Running feed parser job");
            const results = await processAllFeeds(prisma);
            results.forEach(r =>
                fastify.log.info(`✅ Parsed: ${r.feedTitle}, items: ${r.count}`)
            );
        },
        (err) => {
            fastify.log.error("❌ Feed job failed", err);
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
