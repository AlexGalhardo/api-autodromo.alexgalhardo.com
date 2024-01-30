import { PrismaClient, UserRole } from "@prisma/client";
import { Bcrypt } from "../src/Utils/Bcrypt";
import * as jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";

export const prisma = new PrismaClient({
    errorFormat: "pretty",
});

const seedDatabase = async () => {
	try {
		await prisma.race.deleteMany();
		await prisma.kart.deleteMany();
		await prisma.road.deleteMany();
		await prisma.maintenance.deleteMany();
		await prisma.accident.deleteMany();
		await prisma.user.deleteMany();

		const role_token_manager = randomUUID(),
			  role_token_commom = randomUUID(),
			  role_token_affiliate = randomUUID()

		await prisma.user.createMany({
			data: [
				{
					name: "USER MANAGER",
					role: UserRole.MANAGER,
					role_token: role_token_manager,
					email: "manager@gmail.com",
					jwt_token: jwt.sign({ role_token: role_token_manager }, process.env.JWT_SECRET),
					password: await Bcrypt.hash("managerTEST@123")
				},
				{
					name: "USER COMMOM",
					role: UserRole.COMMON,
					role_token: role_token_commom,
					email: "commom@gmail.com",
					jwt_token: jwt.sign({ role_token: role_token_commom }, process.env.JWT_SECRET),
					password: await Bcrypt.hash("commomTEST@123")
				},
				{
					name: "USER AFFILIATE",
					role: UserRole.AFFILIATE,
					role_token: role_token_affiliate,
					email: "affiliate@gmail.com",
					jwt_token: jwt.sign({ role_token: role_token_affiliate }, process.env.JWT_SECRET),
					password: await Bcrypt.hash("affiliateTEST@123")
				},
			]
		});

		console.log("Seed completed successfully.");
	} catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await prisma.$disconnect();
    }
};

// seedDatabase();
