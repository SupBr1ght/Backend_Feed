export const schema = {
	tags: ["feed"],
	summary: "Get feed data and save to DB",
	description:
		"RSS feed endpoint that accepts `url` and optional `force` query parameters",
	querystring: {
		type: "object",
		properties: {
			url: { type: "string", format: "uri", description: "RSS feed URL" },
			force: { type: "boolean", description: "Force refresh feed" },
		},
	},
	response: {
		200: {
			type: "object",
			properties: {
				feedTitle: { type: "string" },
				items: {
					type: "array",
					description: "Array of feed items, parsed in code",
				},
			},
		},
		400: { type: "object", properties: { error: { type: "string" } } },
		500: {
			type: "object",
			properties: { error: { type: "string" }, details: { type: "string" } },
		},
	},
} as const;
