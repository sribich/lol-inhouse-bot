import { SlashCommandBuilder } from "@discordjs/builders"
import { CacheType, Interaction } from "discord.js"

export abstract class Command {
    abstract build(): SlashCommandBuilder

    abstract execute(interaction: Interaction<CacheType>): Promise<void>
}
