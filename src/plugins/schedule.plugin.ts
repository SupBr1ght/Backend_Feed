import fp from "fastify-plugin";
import { fastifySchedule } from "@fastify/schedule";

export default fp(async (fastify) => {
    fastify.register(fastifySchedule);
});
