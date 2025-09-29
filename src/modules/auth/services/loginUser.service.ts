import type { PrismaClient } from "@prisma/client";
import type { FastifyInstance } from "fastify";

export async function loginUser(
	prisma: PrismaClient,
	email: string,
	password: string,
) {
	async function registerUser(fastify: FastifyInstance) {
		// hash password and salt
		const hashedPassword = await fastify.bcrypt.hash(password);
		const verifiedPassword = await fastify.bcrypt.compare(
			password,
			hashedPassword,
		);

		if (!verifiedPassword) {
			throw new Error("Invalid password");
		}
		const user = await prisma.user.findFirst({
			where: {
				email: email,
			},
		});

		if (user === null) throw new Error("Cannot find user");
		return user;
	}
	return { registerUser };
}
