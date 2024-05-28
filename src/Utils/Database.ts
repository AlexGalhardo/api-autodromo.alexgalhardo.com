import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import mongoose from "mongoose";

@Injectable()
export class Database implements OnModuleInit {
	async onModuleInit() {
		try {
			if (mongoose.connection.readyState === 0) {
				await mongoose.connect("mongodb://root:root@localhost/autodromo-mongodb?authSource=admin");
				console.log("Connected to MongoDB!");
			} else {
				console.log("Already connected to MongoDB!");
			}
		} catch (error) {
			console.error("Error connecting to MongoDB: ", error);
			throw new Error(error.message);
		}
	}

	async enableShutdownHooks(app: INestApplication) {
		process.on("beforeExit", async () => {
			try {
				await mongoose.connection.close();
				await app.close();
			} catch (error) {
				console.error("Error closing application: ", error);
				throw new Error(error.message);
			}
		});
	}
}
