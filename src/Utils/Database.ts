import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class Database extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        try {
            await this.$connect();
        } catch (error) {
            console.error("Error connecting to database:", error);
            throw error;
        }
    }

    async enableShutdownHooks(app: INestApplication) {
        process.on("beforeExit", async () => {
            try {
                await app.close();
            } catch (error) {
                console.error("Error closing application: ", error);
                throw error;
            }
        });
    }
}
