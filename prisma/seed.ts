import { PrismaClient, UserRole } from "@prisma/client";
// import { Bcrypt } from "../src/Utils/Bcrypt";
// import * as jwt from "jsonwebtoken";
// import { randomUUID } from "node:crypto";

export const prisma = new PrismaClient({
    errorFormat: "pretty",
});

// const seedDatabase = async () => {
// 	try {
// 		await prisma.user.deleteMany();

// 		const email = "manager@autodromo.com",
// 			  role_token = randomUUID()

// 		await prisma.user.create({
// 			data: {
// 				name: "USER MANAGER",
// 				role: UserRole.MANAGER,
// 				role_token,
// 				email,
// 				jwt_token: jwt.sign({ role_token }, process.env.JWT_SECRET),
// 				password: await Bcrypt.hash("manager@123")
// 			},
// 		});

// 		console.log("Seed completed successfully.");
// 	} catch (error) {
//         console.error("Error seeding database:", error);
//     } finally {
//         await prisma.$disconnect();
//     }
// };

// seedDatabase();
