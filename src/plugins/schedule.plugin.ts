import { fastifySchedule } from "@fastify/schedule";
import fp from "fastify-plugin";

export default fp(async (fastify) => {
	fastify.register(fastifySchedule);
});
