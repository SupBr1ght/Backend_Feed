import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createUserSchema } from "../modules/auth/schemas/userScheme.scheme";

const defaultRoute = async (fastify: FastifyInstance) => {
	const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

	fastify.addHook("preHandler", async (request, reply) => {
		const user = await fastify.prisma.user.findFirst({
			where: {
				id: request.session,
			},
		});
		if (request.url === "/users" && request.session === user._id) {
			return reply.status(401).send({ error: "Not autentificated" });
		}
	});

	route.get(
		"/users",
		{
			schema: createUserSchema,
		},
		async (_request: FastifyRequest, reply: FastifyReply) => {
			const users = await fastify.prisma.user.findMany();
			return reply.status(200).send(users);
		},
	);

	route.get(
		"/users/:id",
		{
			schema: createUserSchema,
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			const { id } = request.params as {
				id: string;
			};
			const user = await fastify.prisma.user.findFirst({
				where: {
					id: id,
				},
			});
			if (request.session !== user._id)
				return reply.status(401).send({ error: "Not autentificated" });
			return reply.status(200).send(user);
		},
	);
};

export default defaultRoute;
