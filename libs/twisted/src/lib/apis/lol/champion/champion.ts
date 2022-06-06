import { Regions } from "../../../constants"
import { endpointsV3, endpointsV4 } from "../../../endpoints/endpoints"
import { ApiResponseDTO, ChampionRotationV3DTO } from "../../../models-dto"
import { ChampionMasteryDTO } from "../../../models-dto/champion/champion-mastery.dto"
import { ChampionsScoreDTO } from "../../../models-dto/champion/champions-score.dto"
import { BaseApiLol } from "../base/base.api.lol"

/**
 * Third party methods
 */
export class ChampionApi extends BaseApiLol {
    /**
     * Get champion rotation
     * @param region Riot region
     */
    public async rotation(region: Regions): Promise<ApiResponseDTO<ChampionRotationV3DTO>> {
        return this.request(region, endpointsV3.ChampionRotation)
    }
    /**
     * Champion mastery by summoner
     * @param encryptedSummonerId
     * @param region
     */
    public async masteryBySummoner(
        encryptedSummonerId: string,
        region: Regions,
    ): Promise<ApiResponseDTO<ChampionMasteryDTO[]>> {
        const params = {
            encryptedSummonerId,
        }
        return this.request<ChampionMasteryDTO[]>(
            region,
            endpointsV4.ChampionMasteryBySummoner,
            params,
        )
    }
    /**
     * Champion mastery by summoner
     * @param encryptedSummonerId
     * @param region
     */
    public async masteryBySummonerChampion(
        encryptedSummonerId: string,
        championId: number,
        region: Regions,
    ): Promise<ApiResponseDTO<ChampionMasteryDTO>> {
        const params = {
            encryptedSummonerId,
            championId,
        }
        return this.request<ChampionMasteryDTO>(
            region,
            endpointsV4.ChampionMasteryBySummonerChampion,
            params,
        )
    }
    /**
     * Champions mastery score
     * @param encryptedSummonerId
     * @param region
     */
    public async championsScore(
        encryptedSummonerId: string,
        region: Regions,
    ): Promise<ChampionsScoreDTO> {
        const params = {
            encryptedSummonerId,
        }
        let { response: score } = await this.request<number | undefined>(
            region,
            endpointsV4.ChampionsScore,
            params,
        )
        if (typeof score !== "number") {
            score = 0
        }
        return {
            score,
        }
    }
}
