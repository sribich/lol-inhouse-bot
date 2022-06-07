import { REST } from "@discordjs/rest"
import { DiscoveryService } from "@inhouse/nestjs-discovery"
import { Injectable, OnModuleInit } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { randomBytes } from "crypto"
import { ButtonInteraction, Client, Intents, MessageButton } from "discord.js"
import { Routes } from "discord-api-types/v10"

import { EnvironmentVariables } from "../../environment"
import { Command } from "./command"
import { DISCORD_COMMAND } from "./discord.decorators"
import { InteractionResult } from "./discord.types"

@Injectable()
export class DiscordService implements OnModuleInit {
    private client: Client
    private commands: Map<string, Command> = new Map()

    private buttonCallbacks: Map<
        string,
        {
            callback: (interaction: ButtonInteraction, data: any) => Promise<InteractionResult>
            data: unknown
        }
    > = new Map()

    constructor(
        private configService: ConfigService<EnvironmentVariables>,
        private discoveryService: DiscoveryService,
    ) {
        this.client = new Client({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            ],
        })

        this.client.on("ready", () => {
            if (this.client.user) {
                console.log(`Logged in as ${this.client.user.tag}`)
            }
        })

        this.client.on("interactionCreate", async (interaction) => {
            if (interaction.isCommand()) {
                const commandName = interaction.commandName

                if (this.commands.has(commandName)) {
                    this.commands.get(commandName)?.execute(interaction)
                }

                return
            }

            if (interaction.isButton()) {
                const callbackMeta = this.buttonCallbacks.get(interaction.customId)

                if (!callbackMeta) {
                    // TODO: Word this better
                    interaction.reply("This command is no longer valid.")
                    return
                }

                if (
                    (await callbackMeta.callback(interaction, callbackMeta.data)) ===
                    InteractionResult.Handled
                ) {
                    this.buttonCallbacks.delete(interaction.customId)
                }

                return
            }

            void 0
        })
    }

    async onModuleInit(): Promise<void> {
        const commandsMeta = await this.discoveryService.providersWithMeta(DISCORD_COMMAND)
        const commands = commandsMeta
            .map((it) => it.discoveredClass.instance)
            .filter((it): it is Command => it instanceof Command)

        this.commands = commands.reduce((acc: Map<string, Command>, it) => {
            const command = it.build()
            acc.set(command.name, it)
            return acc
        }, new Map())

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

    public getButtonComponent<T>(
        callback: (interaction: ButtonInteraction, data: T) => Promise<InteractionResult>,
        data: T,
    ): Omit<MessageButton, "setCustomId"> {
        const id = randomBytes(8).toString("hex")

        if (this.buttonCallbacks.has(id)) {
            return this.getButtonComponent(callback, data)
        }

        this.buttonCallbacks.set(id, {
            callback,
            data,
        })

        return new MessageButton().setCustomId(id)
    }
}
