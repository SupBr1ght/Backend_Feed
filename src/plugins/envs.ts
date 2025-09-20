import fastifyEnv from "@fastify/env";
import fp from "fastify-plugin";

const schema = {
	type: "object",
	required: ["PORT"],
	properties: {
		PORT: { type: "string", default: "3000" },
		DB_URL: { type: "string" },
	},
};

export default fp(async (fastify) => {
	await fastify.register(fastifyEnv, {
		confKey: "config",
		schema,
		dotenv: true,
	});
});
