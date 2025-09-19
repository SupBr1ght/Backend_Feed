"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __importDefault(require("@fastify/env"));
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const schema_1 = require("./schema");
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    try {
        await fastify.register(env_1.default, {
            confKey: "config",
            schema: schema_1.EnvSchema,
            dotenv: true,
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            data: process.env,
            ajv: {
                /**
                 * Custom options for the Ajv instance used by the config plugin.
                 * See https://ajv.js.org/options.html for available options.
                 * @returns {Ajv} An instance of Ajv with custom options set.
                 */
                customOptions: () => {
                    const ajv = new ajv_1.default({
                        allErrors: true,
                        removeAdditional: "all",
                        coerceTypes: true,
                        useDefaults: true,
                    });
                    (0, ajv_formats_1.default)(ajv);
                    return ajv;
                },
            },
        });
        fastify.log.info("✅ Environment variables loaded successfully");
    }
    catch (error) {
        fastify.log.error("❌ Error in config plugin:", error);
        throw error;
    }
}, {
    name: "config-plugin",
});
