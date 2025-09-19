import buildApp from "./app";

async function start() {
	const fastify = await buildApp({
		logger: true,
	});

	const port = fastify.config.PORT;
	const host = fastify.config.HOST;

	try {
		await fastify.listen({ port: 3000 });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
}

void start();
