import fp from "fastify-plugin";
import { AsyncTask, SimpleIntervalJob } from "toad-scheduler";
import { updateFeeds } from "../modules/feedParser/services/cronJob.service";

export default fp(async (fastify) => {
	const task = new AsyncTask(
		"parse feeds (cron)",
		async () => {
			fastify.log.info("Running feed parser job (RssFeed)");
			await updateFeeds(fastify.prisma, fastify.log);
		},
		(err?: Error) => {
			if (err) {
				fastify.log.error({ err }, "Feed job failed");
			}
		},
	);

	const job = new SimpleIntervalJob({ minutes: 30 }, task);

	fastify.ready().then(() => {
		fastify.scheduler.addSimpleIntervalJob(job);
	});
});
