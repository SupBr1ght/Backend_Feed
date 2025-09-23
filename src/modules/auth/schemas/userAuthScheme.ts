export const createUserSchema = {
    tags: ["user"],
    summary: "Create user in db",
    description: "Create user in db",
    type: "object",
    required: ["email", "password"],
    properties: {
        email: {
            type: "string",
            format: "email",
            description: "unique user email ",
        },
        password: { type: "string", minLength: 5, description: "user password" },
    },
    response: {
        200: {
            type: "object",
            properties: {
                email: { type: "string" },
            },
        },
    },
} as const;
