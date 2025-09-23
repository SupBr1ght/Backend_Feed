import fastifyCookie from "fastify-cookie";
import fastifySession from "fastify-session";
import fp from "fastify-plugin";

export default fp(async (fastify) => {

    fastify.register(fastifyCookie);

    fastify.register(fastifySession, {
        cookieName: 'sessionId',
        secret: 'secret',
        cookie: { maxAge: 1800000, secure: false }
    });
})
