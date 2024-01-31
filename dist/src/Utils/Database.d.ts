import { INestApplication, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
export declare class Database extends PrismaClient implements OnModuleInit {
    constructor();
    onModuleInit(): Promise<void>;
    enableShutdownHooks(app: INestApplication): Promise<void>;
}
