import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { loginUser } from "../modules/auth/services/loginUser.service";
import { userAuthSchema } from "../modules/auth/schemas/userAuth.scheme";

const defaultRoute = async (fastify: FastifyInstance) => {
    const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

    route.post(
        "/login",
        {
            schema: userAuthSchema,
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            // enpoint with url and force flag
            const { email, password } = request.body as {
                email: string;
                password: string;
            };
            try {
                // pass Prisma client to keep the service logic separate
                const { registerUser } = await loginUser(fastify.prisma, email, password);

                const user = await registerUser(fastify);

                request.session.sessionId = user.id

                return reply.status(201).send({ email: user.email, id: user.id });
            } catch (error) {
                return reply.status(500).send({ error: error.message })
            }
        },
    );
};

export default defaultRoute;
