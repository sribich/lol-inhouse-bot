import { DiscoveryModule } from "@inhouse/nestjs-discovery"
import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

import { AppConfigModule } from "../app-config/app-config.module"
import { RiotModule } from "../riot/riot.module"
import { RegisterCommand } from "./commands/register.command"
import { SetCategoryIdCommand } from "./commands/set-category-id.command"
import { SetModRoleIdCommand } from "./commands/set-mod-role-id.command"
import { DiscordService } from "./discord.service"

@Module({
    imports: [AppConfigModule, ConfigModule, DiscoveryModule, RiotModule],
    providers: [DiscordService, SetCategoryIdCommand, SetModRoleIdCommand, RegisterCommand],
    exports: [DiscordService],
})
export class DiscordModule {}
