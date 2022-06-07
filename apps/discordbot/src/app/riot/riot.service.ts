import { LolApi } from "@inhouse/twisted"
import { Regions } from "@inhouse/twisted/src/lib/constants"
import { GenericError } from "@inhouse/twisted/src/lib/errors"
import { SummonerV4DTO } from "@inhouse/twisted/src/lib/models-dto"
import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

import { EnvironmentVariables } from "../../environment"

@Injectable()
export class RiotService {
    public api: LolApi
    public tournaments: LolApi

    constructor(private configService: ConfigService<EnvironmentVariables>) {
        this.api = new LolApi({
            key: configService.get("RIOT_DEVELOPMENT_KEY"),
        })
        this.tournaments = new LolApi()
    }

    async getSummonerByName(summonerName: string): Promise<SummonerV4DTO | null> {
        try {
            const summoner = await this.api.Summoner.getByName(summonerName, Regions.AMERICA_NORTH)

            return summoner.response
        } catch (e) {
            if (e instanceof GenericError && e.status === 404) {
                return null
            }

            throw e
        }
    }
}
