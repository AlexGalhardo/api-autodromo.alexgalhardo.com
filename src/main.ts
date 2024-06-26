import { NestFactory } from "@nestjs/core";
import { AppModule } from "./App.module";
import "dotenv/config";
import connectAndSeedToMongoDB from "./config/mongoose";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    connectAndSeedToMongoDB().catch((err) => console.log(err));

    await app.listen(process.env.PORT || 3000, "0.0.0.0", () => {
        console.log(`\n\napi-autodromo.alexgalhardo.com running on http://localhost:${process.env.PORT || 3000}`);
    });
}

bootstrap();
