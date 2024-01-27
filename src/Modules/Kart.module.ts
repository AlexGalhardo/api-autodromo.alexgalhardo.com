import { Module } from "@nestjs/common";
import { KartController} from "src/src/Controllers/Pista.controller
import ContactSendMessageUseCase from "src/UseCases/ContactSendMessage.useCase";

@Module({
    controllers: [KartController],
    providers: [
        {
            provide: "ContactSendMessageUseCasePort",
            inject: [],
            useFactory: () => {
                return new ContactSendMessageUseCase();
            },
        },
    ],
})
export class KartModule {}
