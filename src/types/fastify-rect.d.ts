declare module "@fastify/react" {
    import { FastifyPluginCallback } from "fastify";
    const fastifyReact: FastifyPluginCallback;
    export = fastifyReact;
}