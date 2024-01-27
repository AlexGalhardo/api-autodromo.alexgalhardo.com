"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const Bcrypt_1 = require("../src/Utils/Bcrypt");
const jwt = require("jsonwebtoken");
const node_crypto_1 = require("node:crypto");
const prisma = new client_1.PrismaClient({
    errorFormat: "pretty",
});
const seedDatabase = async () => {
    try {
        await prisma.user.deleteMany();
        const email = "gestor@autodromo.com", role_token = (0, node_crypto_1.randomUUID)();
        await prisma.user.create({
            data: {
                username: "USER GESTOR",
                role: client_1.UserRole.GESTOR,
                role_token,
                email,
                jwt_token: jwt.sign({ role_token }, process.env.JWT_SECRET),
                password: await Bcrypt_1.Bcrypt.hash("gestor123")
            },
        });
        console.log("Seed completed successfully.");
    }
    catch (error) {
        console.error("Error seeding database:", error);
    }
    finally {
        await prisma.$disconnect();
    }
};
seedDatabase();
//# sourceMappingURL=seed.js.map