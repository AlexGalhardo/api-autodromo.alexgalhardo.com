import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class Database extends PrismaClient implements OnModuleInit {
	constructor() {
        super({
            errorFormat: 'minimal',
        });
    }

    async onModuleInit() {
        try {
            await this.$connect();
        } catch (error) {
            console.error("Error connecting to mongodb: ", error);
            throw new Error(error.message)
        }
    }

    async enableShutdownHooks(app: INestApplication) {
        process.on("beforeExit", async () => {
            try {
                await app.close();
            } catch (error) {
                console.error("Error closing application: ", error);
                throw new Error(error.message)
            }
        });
    }
}
