import { SlashCommandBuilder } from "@discordjs/builders"
import { Regions } from "@inhouse/twisted/src/lib/constants"
import { GenericError } from "@inhouse/twisted/src/lib/errors"
import { SummonerV4DTO } from "@inhouse/twisted/src/lib/models-dto"
import { ConfigService } from "@nestjs/config"
import {
    ButtonInteraction,
    CacheType,
    CommandInteraction,
    MessageActionRow,
    MessageEmbed,
} from "discord.js"

import { EnvironmentVariables } from "../../../environment"
import { RiotService } from "../../riot/riot.service"
import { Command } from "../command"
import { DiscordCommand } from "../discord.decorators"
import { DiscordService } from "../discord.service"
import { InteractionResult } from "../discord.types"

type RegisterButtonData = {
    discordId: string
    summoner: SummonerV4DTO
    expectedIcon: number
}

@DiscordCommand()
export class RegisterCommand extends Command {
    private verificationIconA: { url: string; id: number }
    private verificationIconB: { url: string; id: number }

    constructor(
        private configService: ConfigService<EnvironmentVariables>,
        private discordService: DiscordService,
        private riotService: RiotService,
    ) {
        super()

        const iconAUrl = configService.get("VERIFICATION_ICON_URL_A")
        const iconAId = configService.get("VERIFICATION_ICON_ID_A")
        const iconBUrl = configService.get("VERIFICATION_ICON_URL_B")
        const iconBId = configService.get("VERIFICATION_ICON_ID_B")

        if (!iconAUrl || !iconBUrl || !iconAId || !iconBId) {
            throw new Error(`Missing verification icon environment data`)
        }

        this.verificationIconA = {
            url: iconAUrl,
            id: Number.parseInt(iconAId),
        }
        this.verificationIconB = {
            url: iconBUrl,
            id: Number.parseInt(iconBId),
        }
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

        const summonerName = interaction.options.getString("summoner_name", true)
        const summoner = await this.riotService.getSummonerByName(summonerName)

        if (!summoner) {
            interaction.reply(`Summoner ${summonerName} does not exist`)
            return
        }

        // TODO: Check is summoner is already registered

        const verificationIcon =
            summoner.profileIconId === this.verificationIconA.id
                ? this.verificationIconB
                : this.verificationIconA

        const embed = new MessageEmbed()
            .setThumbnail(verificationIcon.url)
            .setDescription(
                "Please set your summoner icon to the icon indicated on the right and then click 'Register' below. The icon should appear near the bottom of the icon list.",
            )

        const button = this.discordService.getButtonComponent(this.verify.bind(this), {
            discordId: interaction.user.id,
            summoner,
            expectedIcon: verificationIcon.id,
        })

        const row = new MessageActionRow().addComponents(
            button.setLabel("Register").setStyle("PRIMARY"),
        )

        interaction.reply({ embeds: [embed], components: [row] })
    }

    async verify(
        interaction: ButtonInteraction,
        data: RegisterButtonData,
    ): Promise<InteractionResult> {
        let summoner

        try {
            summoner = await this.riotService.api.Summoner.getByName(
                data.summoner.name,
                Regions.AMERICA_NORTH,
            )
        } catch (e) {
            if (e instanceof GenericError && e.status === 404) {
                interaction.reply(`Summoner ${data.summoner.name} does not exist`)
                return InteractionResult.NotHandled
            }

            throw e
        }

        if (summoner.response.profileIconId === data.expectedIcon) {
            interaction.reply("Set")

            return InteractionResult.Handled
        }

        interaction.reply("Not set")

        return InteractionResult.NotHandled
    }
}
