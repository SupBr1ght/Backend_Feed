import { join } from "node:path";
import AutoLoad from "@fastify/autoload";
import Fastify, { type FastifyServerOptions } from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
export type AppOptions = Partial<FastifyServerOptions>;

/**
 * Builds a Fastify server with plugins loaded.
 * @param {AppOptions} options - Options for the Fastify server.
 * @returns {Promise<Fastify>} - A promise that resolves with a Fastify server instance.
 */
async function buildApp(options: AppOptions = {}) {
	const fastify = Fastify({ logger: true });

	try {
		fastify.decorate("pluginLoaded", (pluginName: string) => {
			fastify.log.info(`✅ Plugin loaded: ${pluginName}`);
		});

		await fastify.register(fastifySwagger, {
			openapi: {
				openapi: "3.0.0",
				info: {
					title: "Test swagger",
					description: "Testing the Fastify swagger API",
					version: "0.1.0",
				},
				servers: [{ url: "http://localhost:3000" }],
			},
		});

		fastify.log.info("Starting to load plugins");
		await fastify.register(AutoLoad, {
			dir: join(__dirname, "plugins"),
			options: options,
			ignorePattern: /^((?!plugin).)*$/,
		});

		// load routes from feedparser
		await fastify.register(AutoLoad, {
			dir: join(__dirname, "modules/feedParser/routes"),
		});

		// load routes from root
		await fastify.register(AutoLoad, {
			dir: join(__dirname, "/routes"),
		});

		await fastify.register(fastifySwaggerUi, {
			routePrefix: "/documentation",
			uiConfig: {
				docExpansion: "full",
				deepLinking: false,
			},
			staticCSP: true,
			transformStaticCSP: (header) => header,
			transformSpecificationClone: true,
		});

		fastify.log.info("✅ Plugins loaded successfully");
	} catch (error) {
		fastify.log.error("Error in autoload:", error);
		throw error;
	}

	return fastify;
}

export default buildApp;
