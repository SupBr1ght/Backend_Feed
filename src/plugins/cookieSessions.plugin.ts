import fp from "fastify-plugin";
import cookie from "@fastify/cookie";
import session from "@fastify/session";

export default fp(async (fastify) => {
    fastify.register(cookie);

    const secret = fastify.config.COOKIE_SECRET;
    if (!secret) throw new Error("COOKIE_SECRET is not defined");

    // Потім сесія
    fastify.register(session, {
        secret: secret,
        cookieName: "sessionId",
        cookie: {
            secure: false,
            maxAge: 1800000,
            httpOnly: true,
        },
    });
});
