import fp from "fastify-plugin";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

export default fp(async (fastify) => {
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
});
