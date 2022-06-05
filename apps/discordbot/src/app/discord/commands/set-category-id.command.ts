import { SlashCommandBuilder } from "@discordjs/builders"
import { CacheType, CommandInteraction } from "discord.js"

import { AppConfigService } from "../../app-config/app-config.service"
import { Command } from "../command"
import { DiscordCommand } from "../discord.decorators"

@DiscordCommand()
export class SetCategoryIdCommand extends Command {
    constructor(private appConfigService: AppConfigService) {
        super()
    }

    build(): SlashCommandBuilder {
        const command = new SlashCommandBuilder()
            .setName("set-category-id")
            .setDescription(
                "Sets that category ID that the bot will use to create inhouse channels in",
            )

        command.addStringOption((builder) => {
            return builder.setName("id").setDescription("...").setRequired(true)
        })

        return command
    }

    async execute(interaction: CommandInteraction<CacheType>): Promise<void> {
        if (!interaction.isRepliable()) {
            return
        }

        const categoryId = interaction.options.getString("id", true)

        const validCategoryIds =
            interaction.guild?.channels.cache
                .filter((it) => it.type === "GUILD_CATEGORY")
                .map((it) => it.id) || []

        if (!validCategoryIds.includes(categoryId)) {
            interaction.reply(`Channel id '${categoryId}' is not a valid category`)
            return
        }

        await this.appConfigService.createOrUpdate("inhouse_category_id", categoryId)

        interaction.reply("Category id set")
    }
}
