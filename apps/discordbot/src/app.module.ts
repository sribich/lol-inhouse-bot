import { Module } from "@nestjs/common"

import { AppConfigModule } from "./app/app-config/app-config.module"
import { DiscordModule } from "./app/discord/discord.module"
import { PrismaModule } from "./app/prisma/prisma.module"
import { RiotModule } from "./app/riot/riot.module"

@Module({
    imports: [AppConfigModule, DiscordModule, PrismaModule, RiotModule],
})
export class AppModule {}
