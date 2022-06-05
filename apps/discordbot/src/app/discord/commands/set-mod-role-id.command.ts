import { SlashCommandBuilder } from "@discordjs/builders"
import { CacheType, CommandInteraction } from "discord.js"

import { AppConfigService } from "../../app-config/app-config.service"
import { Command } from "../command"
import { DiscordCommand } from "../discord.decorators"

@DiscordCommand()
export class SetModRoleIdCommand extends Command {
    constructor(private appConfigService: AppConfigService) {
        super()
    }

    build(): SlashCommandBuilder {
        const command = new SlashCommandBuilder()
            .setName("set-mod-role-id")
            .setDescription("Sets the mod role ID that users must have to create inhouses")

        command.addStringOption((builder) => {
            return builder.setName("id").setDescription("...").setRequired(true)
        })

        return command
    }

    async execute(interaction: CommandInteraction<CacheType>): Promise<void> {
        if (!interaction.isRepliable()) {
            return
        }

        const roleId = interaction.options.getString("id", true)

        const validCategoryIds = interaction.guild?.roles.cache.map((it) => it.id) || []

        if (!validCategoryIds.includes(roleId)) {
            interaction.reply(`Role id '${roleId}' does not exist`)
            return
        }

        await this.appConfigService.createOrUpdate("inhouse_mod_role_id", roleId)

        interaction.reply("Role id set")
    }
}
