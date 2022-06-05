import { CustomDecorator, SetMetadata } from "@nestjs/common"

export const DISCORD_COMMAND = Symbol.for("DISCORD_COMMAND")

export const DiscordCommand = (): CustomDecorator<unknown> => SetMetadata(DISCORD_COMMAND, {})
