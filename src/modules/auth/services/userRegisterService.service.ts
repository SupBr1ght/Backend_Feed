import type { PrismaClient } from "@prisma/client";
import type { FastifyInstance } from "fastify";
export async function createUser(
	prisma: PrismaClient,
	email: string,
	password: string,
) {
	async function registerUser(fastify: FastifyInstance) {
		// hash password and salt
		const hashedPassword = await fastify.bcrypt.hash(password);

		const user = await prisma.user.create({
			data: {
				email,
				Hashedpassword: hashedPassword,
			},
		});

		if (user === null) throw new Error("User not created");
		return user;
	}
	return { registerUser };
} 
