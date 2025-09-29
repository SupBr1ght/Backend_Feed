import type { Config } from "../config/schema";
import { ToadScheduler } from "toad-scheduler";
import { ReactElement } from "react";

declare module "fastify" {
	interface FastifyInstance {
		config: Config;
		pluginLoaded: (pluginName: string) => void;
		prisma: PrismaClient;
		userId: string;
		scheduler: ToadScheduler;

	}
	interface FastifyReply {
		react(component: string | ReactElement, props?: Record<string, any>): void;
	}

	interface FastifyRequest {
		parts(): AsyncIterableIterator<any>;
	}


}
