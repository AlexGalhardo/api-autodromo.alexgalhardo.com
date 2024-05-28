import mongoose from "mongoose";
import { Bcrypt } from "src/Utils/Bcrypt";
import * as jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";

export enum UserRole {
	"MANAGER" = "MANAGER",
	"AFFILIATE" = "AFFILIATE",
	"COMMON" = "COMMON",
}

export enum NotificationType {
	"RACE_STARTED" = "RACE_STARTED",
	"RACE_ACCIDENT" = "RACE_ACCIDENT",
}

export enum RaceStatus {
	"SCHEDULED" = "SCHEDULED",
	"FINISHED" = "FINISHED",
	"ABORTED" = "ABORTED",
}

export enum KartStatus {
	"LEASED" = "LEASED",
	"IN_MAINTENANCE" = "IN_MAINTENANCE",
	"AVAILABLE" = "AVAILABLE",
}

export default async function connectAndSeedToMongoDB() {
	await mongoose.connect("mongodb://root:root@localhost/autodromo-mongodb?authSource=admin");

	try {
		await seedDatabase();
		console.log("Seed completed successfully.");
	} catch (error) {
		if (error.code === 11000) {
			console.log("\n\n...Product already exists, skipping seeding");
		} else {
			console.error("\n\n...Error seeding product:", error);
		}
	}
}

const { Schema } = mongoose;

const UserSchema = new Schema(
	{
		name: { type: String, required: true },
		role: { type: String, enum: ["MANAGER", "COMMON", "AFFILIATE"], required: true },
		role_token: { type: String, required: true, unique: true },
		email: { type: String, unique: true, required: true },
		jwt_token: { type: String, unique: true, required: true },
		password: { type: String, required: true },
	},
	{ collection: "users" },
);

export const User = mongoose.model("User", UserSchema);

const KartSchema = new Schema(
	{
		name: { type: String, required: true },
		status: { type: String, enum: ["AVAILABLE", "IN_USE", "UNDER_MAINTENANCE"], required: true },
		brand: { type: String, required: true },
		model: { type: String, required: true },
		power: { type: Number, required: true },
		tire_brand: { type: String, required: true },
	},
	{ collection: "karts" },
);

export const Kart = mongoose.model("Kart", KartSchema);

const RoadSchema = new Schema(
	{
		name: { type: String, required: true },
		kilometers: { type: Number, required: true },
		quantity_boxes: { type: Number, required: true },
		quantity_places: { type: Number, required: true },
		address: { type: String, required: true },
	},
	{ collection: "roads" },
);

export const Road = mongoose.model("Road", RoadSchema);

const ScheduleSchema = new Schema(
	{
		user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
		kart_id: { type: Schema.Types.ObjectId, ref: "Kart", required: true },
		road_id: { type: Schema.Types.ObjectId, ref: "Road", required: true },
		starts_at: { type: Date, required: true },
		ends_at: { type: Date, required: true },
		created_at: { type: Date, default: Date.now },
		updated_at: { type: Date },
	},
	{ collection: "schedules" }
);

export const Schedule = mongoose.model("Schedule", ScheduleSchema);

const RaceSchema = new Schema(
	{
		user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
		kart_id: { type: Schema.Types.ObjectId, ref: "Kart", required: true },
		road_id: { type: Schema.Types.ObjectId, ref: "Road", required: true },
		starts_at: { type: Date, required: true },
		ends_at: { type: Date },
		had_an_schedule_during_this_period: { type: Boolean, required: true },
		status: { type: String, enum: ["PENDING", "ONGOING", "COMPLETED", "CANCELLED"], required: true }, // Replace with actual RaceStatus enum values
		created_at: { type: Date, default: Date.now },
		updated_at: { type: Date },
	},
	{ collection: "races" }
);

export const Race = mongoose.model("Race", RaceSchema);

const MaintenanceSchema = new Schema(
	{
		kart_id: { type: Schema.Types.ObjectId, ref: "Kart", required: true },
		reason: { type: String, required: true },
		starts_at: { type: Date, required: true },
		ends_at: { type: Date, required: true },
		created_at: { type: Date, default: Date.now },
		updated_at: { type: Date },
	},
	{ collection: "maintenances" }
);

export const Maintenance = mongoose.model("Maintenance", MaintenanceSchema);

const AccidentSchema = new Schema(
	{
		involved: { type: Schema.Types.Mixed, required: true },
		road_id: { type: Schema.Types.ObjectId, ref: "Road", required: true },
		happened_at: { type: Date, required: true },
		created_at: { type: Date, default: Date.now },
		updated_at: { type: Date },
	},
	{ collection: "accidents" }
);

export const Accident = mongoose.model("Accident", AccidentSchema);

const NotificationSchema = new Schema(
	{
		type: { type: String, enum: ["INFO", "WARNING", "ERROR"], required: true },
		message: { type: String, required: true },
		race_id: { type: Schema.Types.ObjectId, ref: "Race", required: true },
		send_to_users_ids: { type: [Schema.Types.ObjectId], ref: "User", required: true },
		created_at: { type: Date, default: Date.now },
	},
	{ collection: "notifications" }
);

export const Notification = mongoose.model("Notification", NotificationSchema);

const seedDatabase = async () => {
	try {
		await User.deleteMany();
		await Kart.deleteMany();
		await Road.deleteMany();

		const role_token_manager = randomUUID(),
			role_token_common = randomUUID(),
			role_token_affiliate = randomUUID();

		const users = [
			{
				name: "USER MANAGER",
				role: "MANAGER",
				role_token: role_token_manager,
				email: "manager@gmail.com",
				jwt_token: jwt.sign({ role_token: role_token_manager }, process.env.JWT_SECRET),
				password: await Bcrypt.hash("managerTEST@123"),
			},
			{
				name: "USER COMMON",
				role: "COMMON",
				role_token: role_token_common,
				email: "common@gmail.com",
				jwt_token: jwt.sign({ role_token: role_token_common }, process.env.JWT_SECRET),
				password: await Bcrypt.hash("commonTEST@123")
			},
			{
				name: "USER AFFILIATE",
				role: "AFFILIATE",
				role_token: role_token_affiliate,
				email: "affiliate@gmail.com",
				jwt_token: jwt.sign({ role_token: role_token_affiliate }, process.env.JWT_SECRET),
				password: await Bcrypt.hash("affiliateTEST@123")
			},
		];

		await User.insertMany(users);

		const karts = [
			{
				name: "KART ONE",
				status: "AVAILABLE",
				brand: "Brand One",
				model: "Model One",
				power: 100,
				tire_brand: "Tire Brand One",
			},
			{
				name: "KART TWO",
				status: "AVAILABLE",
				brand: "Brand TWO",
				model: "Model TWO",
				power: 200,
				tire_brand: "Tire Brand TWO",
			},
			{
				name: "KART THREE",
				status: "AVAILABLE",
				brand: "Brand THREE",
				model: "Model THREE",
				power: 300,
				tire_brand: "Tire Brand THREE",
			},
		];

		await Kart.insertMany(karts);

		const roads = [
			{
				name: "ROAD ONE",
				kilometers: 10,
				quantity_boxes: 100,
				quantity_places: 1000,
				address: "ADDRESS ONE",
			},
			{
				name: "ROAD TWO",
				kilometers: 20,
				quantity_boxes: 200,
				quantity_places: 2000,
				address: "ADDRESS TWO",
			},
			{
				name: "ROAD THREE",
				kilometers: 30,
				quantity_boxes: 300,
				quantity_places: 3000,
				address: "ADDRESS THREE",
			},
		];

		await Road.insertMany(roads);

	} catch (error) {
		console.error("Error seeding database:", error);
	}
};

const mongodb = mongoose.connection;

mongodb.on("error", console.error.bind(console, "\n\n...ERROR to connect to MongoDB: "));

mongodb.once("open", () => {
	console.log("\n\n...Connected to mongodb!");
});
