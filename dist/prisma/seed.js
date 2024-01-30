"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const Bcrypt_1 = require("../src/Utils/Bcrypt");
const jwt = require("jsonwebtoken");
const node_crypto_1 = require("node:crypto");
exports.prisma = new client_1.PrismaClient({
    errorFormat: "pretty",
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
                    name: "USER COMMOM",
                    role: client_1.UserRole.COMMON,
                    role_token: role_token_commom,
                    email: "commom@gmail.com",
                    jwt_token: jwt.sign({ role_token: role_token_commom }, process.env.JWT_SECRET),
                    password: await Bcrypt_1.Bcrypt.hash("commomTEST@123")
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