import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";

import fp from "fastify-plugin";

export default fp(async (fastify) => {

    fastify.register(fastifyCookie);

    const secret = process.env.COOKIE_SECRET

    if (!secret) {
        throw new Error('COOKIE_SECRET is not defined')
    }

    fastify.register(fastifySession, {
        cookieName: 'sessionId',
        secret,
        cookie: { maxAge: 1800000, secure: false }
    });

});
