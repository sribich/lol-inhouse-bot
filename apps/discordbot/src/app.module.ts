import { Module } from "@nestjs/common"
import { DiscordModule } from "./app/discord/discord.module"

@Module({
    imports: [DiscordModule],
})
export class AppModule {}
