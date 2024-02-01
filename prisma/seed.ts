import { KartStatus, PrismaClient, UserRole } from "@prisma/client";
import { Bcrypt } from "../src/Utils/Bcrypt";
import * as jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";

export const prisma = new PrismaClient({
    errorFormat: "minimal",
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
					name: "USER COMMON",
					role: UserRole.COMMON,
					role_token: role_token_commom,
					email: "common@gmail.com",
					jwt_token: jwt.sign({ role_token: role_token_commom }, process.env.JWT_SECRET),
					password: await Bcrypt.hash("commonTEST@123")
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

		await prisma.kart.createMany({
			data: [
				{
					name: "KART ONE",
					status: KartStatus.AVAILABLE,
					brand: "Brand One",
					model: "Model One",
					power: 100,
					tire_brand: 'Tire Brand One'
				},
				{
					name: "KART TWO",
					status: KartStatus.AVAILABLE,
					brand: "Brand TWO",
					model: "Model TWO",
					power: 200,
					tire_brand: 'Tire Brand TWO'
				},
				{
					name: "KART THREE",
					status: KartStatus.AVAILABLE,
					brand: "Brand THREE",
					model: "Model THREE",
					power: 300,
					tire_brand: 'Tire Brand THREE'
				},
			]
		});

		await prisma.road.createMany({
			data: [
				{
					name: "ROAD ONE",
					kilometers: 10,
					quantity_boxes: 100,
					quantity_places: 1000,
					address: "ADDRESS ONE"
				},
				{
					name: "ROAD TWO",
					kilometers: 20,
					quantity_boxes: 200,
					quantity_places: 2000,
					address: "ADDRESS TWO"
				},
				{
					name: "ROAD THREE",
					kilometers: 30,
					quantity_boxes: 300,
					quantity_places: 3000,
					address: "ADDRESS THREE"
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
