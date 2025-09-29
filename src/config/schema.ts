import type { FromSchema } from "json-schema-to-ts";

export const EnvSchema = {
	type: "object",
	properties: {
		PORT: { type: "number" },
		HOST: { type: "string" },
		MONGO_URI: { type: "string" },
		COOKIE_SECRET: { type: "string" },
		COOKIE_SECURE: { type: "boolean" },
		COOKIE_MAX_AGE: { type: "number" },
		COOKIE_HTTP_ONLY: { type: "boolean" },
		FULL_HOST: { type: "string" },
		CORS_ORIGIN: { type: "string" },
	},
	required: ["PORT", "HOST", "MONGO_URI", "COOKIE_SECRET"],
	additionalProperties: false,
} as const;

export type Config = FromSchema<typeof EnvSchema>;
