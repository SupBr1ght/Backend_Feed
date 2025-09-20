import { join } from "node:path";
import AutoLoad from "@fastify/autoload";
import Fastify, { type FastifyServerOptions } from "fastify";
import configPlugin from "./config";
export type AppOptions = Partial<FastifyServerOptions>;

/**
 * Builds a Fastify server with plugins loaded.
 * @param {AppOptions} options - Options for the Fastify server.
 * @returns {Promise<Fastify>} - A promise that resolves with a Fastify server instance.
 */
async function buildApp(options: AppOptions = {}) {
	const fastify = Fastify({ logger: true });
	await fastify.register(configPlugin);

	try {
		fastify.decorate("pluginLoaded", (pluginName: string) => {
			fastify.log.info(`✅ Plugin loaded: ${pluginName}`);
		});

		fastify.log.info("Starting to load plugins");
		await fastify.register(AutoLoad, {
			dir: join(__dirname, "plugins"),
			options: options,
			ignorePattern: /^((?!plugin).)*$/,
		});

		await fastify.register(AutoLoad, {
			dir: join(__dirname, "routes"),
		});

		fastify.log.info("✅ Plugins loaded successfully");
	} catch (error) {
		fastify.log.error("Error in autoload:", error);
		throw error;
	}

	return fastify;
}

export default buildApp;
