import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createUserSchema } from "../schemas/userScheme.scheme";
import { createUser } from "../services/userRegisterService.service";

const defaultRoute = async (fastify: FastifyInstance) => {
	const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

	route.post(
		"/user",
		{
			schema: createUserSchema,
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			// enpoint with url and force flag
			const { email, password } = request.body as {
				email: string;
				password: string;
			};
			try {
				// pass Prisma client to keep the service logic separate
				return await createUser(fastify.prisma, email, password);
			} catch (error) {
				return reply.status(500).send({ error: error.message });
			}
		},
	);
};

export default defaultRoute;
