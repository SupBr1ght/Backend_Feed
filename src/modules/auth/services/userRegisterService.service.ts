import type { PrismaClient } from "@prisma/client";

export async function createUser(
	prisma: PrismaClient,
	email: string,
	password: string,
) {
	async function registerUser() {
		// hash password and salt
		const hashedPassword = await hashPassword(password);

		const user = await prisma.user.create({
			data: {
				email,
				password,
				salt: "",
			},
		});
		return user;
	}
	return { registerUser };
}
