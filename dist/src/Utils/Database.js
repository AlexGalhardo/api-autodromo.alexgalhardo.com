"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let Database = class Database extends client_1.PrismaClient {
    constructor() {
        super({
            errorFormat: "minimal",
        });
    }
    async onModuleInit() {
        try {
            await this.$connect();
        }
        catch (error) {
            console.error("Error connecting to mongodb: ", error);
            throw new Error(error.message);
        }
    }
    async enableShutdownHooks(app) {
        process.on("beforeExit", async () => {
            try {
                await app.close();
            }
            catch (error) {
                console.error("Error closing application: ", error);
                throw new Error(error.message);
            }
        });
    }
};
exports.Database = Database;
exports.Database = Database = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], Database);
//# sourceMappingURL=Database.js.map