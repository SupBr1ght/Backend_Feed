import type { Config } from "../config/schema";
import { ToadScheduler } from "toad-scheduler";

declare module "fastify" {
	interface FastifyInstance {
		config: Config;
		pluginLoaded: (pluginName: string) => void;
		prisma: PrismaClient;
		userId: string;
		scheduler: ToadScheduler;
	}
}
