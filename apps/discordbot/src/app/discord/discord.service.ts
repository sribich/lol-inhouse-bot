import { REST } from "@discordjs/rest"
import { DiscoveryService } from "@inhouse/nestjs-discovery"
import { Injectable, OnModuleInit } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Client, Intents } from "discord.js"
import { Routes } from "discord-api-types/v10"

import { EnvironmentVariables } from "../../environment"
import { Command } from "./command"
import { DISCORD_COMMAND } from "./discord.decorators"

@Injectable()
export class DiscordService implements OnModuleInit {
    private client: Client
    private commands: Record<string, Command> = {}

    constructor(
        private configService: ConfigService<EnvironmentVariables>,
        private discoveryService: DiscoveryService,
    ) {
        this.client = new Client({
            intents: [Intents.FLAGS.GUILDS],
        })

        this.client.on("ready", () => {
            if (this.client.user) {
                console.log(`Logged in as ${this.client.user.tag}`)
            }
        })

        this.client.on("interactionCreate", async (interaction) => {
            if (interaction.isCommand()) {
                const commandName = interaction.commandName

                if (this.commands[commandName]) {
                    this.commands[commandName].execute(interaction)
                }
            }
        })

        this.client.on("messageReactionAdd", async (reaction) => {
            console.log(reaction)

            reaction.message.channel.send("@person lobby is already full")
        })
    }

    async onModuleInit(): Promise<void> {
        const commandsMeta = await this.discoveryService.providersWithMeta(DISCORD_COMMAND)
        const commands = commandsMeta
            .map((it) => it.discoveredClass.instance)
            .filter((it): it is Command => it instanceof Command)

        this.commands = commands.reduce((acc: Record<string, Command>, it) => {
            const command = it.build()
            acc[command.name] = it
            return acc
        }, {})

        const secret = this.configService.get("DISCORD_BOT_SECRET")
        const clientId = this.configService.get("DISCORD_BOT_CLIENT_ID")
        const guildId = this.configService.get("DISCORD_BOT_GUILD_ID")

        await this.client.login(secret)

        const rest = new REST({ version: "10" }).setToken(secret)

        const commandJson = commands.map((it) => it.build()).map((it) => it.toJSON())

        rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commandJson })
            .then(() => console.log("Successfully registered application commands."))
            .catch(console.error)
    }
}
