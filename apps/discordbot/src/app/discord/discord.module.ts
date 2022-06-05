import { DiscoveryModule } from "@inhouse/nestjs-discovery"
import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

import { AppConfigModule } from "../app-config/app-config.module"
import { SetCategoryIdCommand } from "./commands/set-category-id.command"
import { SetModRoleIdCommand } from "./commands/set-mod-role-id.command"
import { DiscordService } from "./discord.service"

@Module({
    imports: [AppConfigModule, ConfigModule, DiscoveryModule],
    providers: [DiscordService, SetCategoryIdCommand, SetModRoleIdCommand],
    exports: [DiscordService],
})
export class DiscordModule {}
