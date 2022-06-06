import { SlashCommandBuilder } from "@discordjs/builders"
import { CacheType, CommandInteraction, Message, MessageActionRow } from "discord.js"

import { AppConfigService } from "../../app-config/app-config.service"
import { Command } from "../command"
import { DiscordCommand } from "../discord.decorators"
import { DiscordService } from "../discord.service"

@DiscordCommand()
export class RegisterCommand extends Command {
    constructor(
        private appConfigService: AppConfigService,
        private discordService: DiscordService,
    ) {
        super()
    }

    build(): SlashCommandBuilder {
        const command = new SlashCommandBuilder()
            .setName("register")
            .setDescription("Register your summoner name with the inhouse bot.")

        command.addStringOption((builder) => {
            return builder
                .setName("summoner_name")
                .setDescription("Your League of Legends summoner name")
                .setRequired(true)
        })

        return command
    }

    async execute(interaction: CommandInteraction<CacheType>): Promise<void> {
        if (!interaction.isRepliable()) {
            return
        }

        // const summonerName = interaction.options.getString("summoner_name", true)

        console.log(interaction)

        /*
        if (!validCategoryIds.includes(categoryId)) {
            interaction.reply(`Channel id '${categoryId}' is not a valid category`)
            return
        }

        await this.appConfigService.createOrUpdate("inhouse_category_id", categoryId)
        */

        const button = this.discordService.getButtonComponent(async () => {
            console.log("Button clicked :OOOO")
        })

        const setButton = new MessageActionRow().addComponents(
            button.setLabel("???").setStyle("PRIMARY"),
        )

        await interaction.reply({ content: "...", components: [setButton] })

        const message = await interaction.fetchReply()

        if (message instanceof Message) {
            message.react("😄")
        }
    }
}
