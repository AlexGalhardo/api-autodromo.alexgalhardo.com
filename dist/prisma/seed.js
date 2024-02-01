"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const Bcrypt_1 = require("../src/Utils/Bcrypt");
const jwt = require("jsonwebtoken");
const node_crypto_1 = require("node:crypto");
exports.prisma = new client_1.PrismaClient({
    errorFormat: "minimal",
});
const seedDatabase = async () => {
    try {
        await exports.prisma.race.deleteMany();
        await exports.prisma.kart.deleteMany();
        await exports.prisma.road.deleteMany();
        await exports.prisma.maintenance.deleteMany();
        await exports.prisma.accident.deleteMany();
        await exports.prisma.user.deleteMany();
        const role_token_manager = (0, node_crypto_1.randomUUID)(), role_token_commom = (0, node_crypto_1.randomUUID)(), role_token_affiliate = (0, node_crypto_1.randomUUID)();
        await exports.prisma.user.createMany({
            data: [
                {
                    name: "USER MANAGER",
                    role: client_1.UserRole.MANAGER,
                    role_token: role_token_manager,
                    email: "manager@gmail.com",
                    jwt_token: jwt.sign({ role_token: role_token_manager }, process.env.JWT_SECRET),
                    password: await Bcrypt_1.Bcrypt.hash("managerTEST@123")
                },
                {
                    name: "USER COMMON",
                    role: client_1.UserRole.COMMON,
                    role_token: role_token_commom,
                    email: "common@gmail.com",
                    jwt_token: jwt.sign({ role_token: role_token_commom }, process.env.JWT_SECRET),
                    password: await Bcrypt_1.Bcrypt.hash("commonTEST@123")
                },
                {
                    name: "USER AFFILIATE",
                    role: client_1.UserRole.AFFILIATE,
                    role_token: role_token_affiliate,
                    email: "affiliate@gmail.com",
                    jwt_token: jwt.sign({ role_token: role_token_affiliate }, process.env.JWT_SECRET),
                    password: await Bcrypt_1.Bcrypt.hash("affiliateTEST@123")
                },
            ]
        });
        await exports.prisma.kart.createMany({
            data: [
                {
                    name: "KART ONE",
                    status: client_1.KartStatus.AVAILABLE,
                    brand: "Brand One",
                    model: "Model One",
                    power: 100,
                    tire_brand: 'Tire Brand One'
                },
                {
                    name: "KART TWO",
                    status: client_1.KartStatus.AVAILABLE,
                    brand: "Brand TWO",
                    model: "Model TWO",
                    power: 200,
                    tire_brand: 'Tire Brand TWO'
                },
                {
                    name: "KART THREE",
                    status: client_1.KartStatus.AVAILABLE,
                    brand: "Brand THREE",
                    model: "Model THREE",
                    power: 300,
                    tire_brand: 'Tire Brand THREE'
                },
            ]
        });
        await exports.prisma.road.createMany({
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
    }
    catch (error) {
        console.error("Error seeding database:", error);
    }
    finally {
        await exports.prisma.$disconnect();
    }
};
//# sourceMappingURL=seed.js.map