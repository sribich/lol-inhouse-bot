import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Client, Intents } from "discord.js"
import { EnvironmentVariables } from "../../environment"

@Injectable()
export class DiscordService {
    constructor(
        private configService: ConfigService<EnvironmentVariables>,
    ) {
        const d = new Client({
            intents: [
                Intents.FLAGS.GUILDS,
            ]
        })

        d.login(configService.get("DISCORD_BOT_SECRET"))
    }
}
