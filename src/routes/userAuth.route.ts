import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { loginUser } from "../modules/auth/services/loginUser.service";
import { userAuthSchema } from "../modules/auth/schemas/userAuth.scheme";

const defaultRoute = async (fastify: FastifyInstance) => {
    const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

    route.get(
        "/profile",
        {
            schema: userAuthSchema,
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const user = await fastify.prisma.user.findFirst({
                where: {
                    id: request.session.userId
                }
            })
            return reply.status(200).send(user);
        }
    )

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

                // set session
                request.session.userId = { id: user.id };

                return reply.status(201).send({ "logged in": user.email });
            } catch (error) {
                return reply.status(500).send({ error: error.message })
            }
        },
    );
};

export default defaultRoute;
