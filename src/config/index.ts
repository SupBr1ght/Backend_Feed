import cookie from "@fastify/cookie";
import { fastifyCors } from "@fastify/cors";
import fastifyEnv from "@fastify/env";
import fastifySession from "@fastify/session";
import Ajv from "ajv";
import ajvFormats from "ajv-formats";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { EnvSchema } from "./schema";

export default fp(
	async (fastify: FastifyInstance) => {
		try {
			await fastify.register(fastifyEnv, {
				confKey: "config",
				schema: EnvSchema,
				dotenv: true,
				data: process.env,
				ajv: {
					/**
					 * Custom options for the Ajv instance used by the config plugin.
					 * See https://ajv.js.org/options.html for available options.
					 * @returns {Ajv} An instance of Ajv with custom options set.
					 */
					customOptions: (): Ajv => {
						const ajv = new Ajv({
							allErrors: true,
							removeAdditional: "all",
							coerceTypes: true,
							useDefaults: true,
						});
						ajvFormats(ajv);
						return ajv;
					},
				},
			});

			fastify.register(fastifyCors, {
				origin: `${fastify.config.CORS_ORIGIN}`,
			});
			const secret = fastify.config.COOKIE_SECRET;
			if (!secret) throw new Error("COOKIE_SECRET is not defined");

			fastify.register(cookie);

			await fastify.register(fastifySession, {
				secret: secret,
				cookieName: "sessionId",
				cookie: {
					secure: fastify.config.COOKIE_SECURE,
					maxAge: fastify.config.COOKIE_MAX_AGE,
					httpOnly: fastify.config.COOKIE_HTTP_ONLY,
				},
			});
			fastify.setErrorHandler((error, _request, _reply) => {
				throw error;
			});

			fastify.log.info("✅ Environment variables loaded successfully");
		} catch (error) {
			fastify.log.error("❌ Error in config plugin:", error);
			throw error;
		}
	},
	{
		name: "config-plugin",
	},
);
