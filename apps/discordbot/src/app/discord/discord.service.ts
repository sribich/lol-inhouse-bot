import { Injectable } from "@nestjs/common"
import { Client, Intents } from "discord.js"

@Injectable()
export class DiscordService {
    constructor() {
        const d = new Client({
            intents: [
                Intents.FLAGS.GUILDS,
            ]
        })

        d.login("")
    }
}
