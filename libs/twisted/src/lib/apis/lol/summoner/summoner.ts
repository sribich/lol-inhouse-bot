import * as _ from "lodash"

import { Regions } from "../../../constants"
import { FindSummonerBy } from "../../../constants/summoner.find"
import { endpointsV4, IEndpoint } from "../../../endpoints/endpoints"
import { ApiResponseDTO } from "../../../models-dto"
import { SummonerV4DTO } from "../../../models-dto/summoners/summoner.dto"
import { BaseApiLol } from "../base/base.api.lol"

/**
 * Summoner methods
 */
export class SummonerApi extends BaseApiLol {
    private parsePath(endpoint: IEndpoint, by: FindSummonerBy): string {
        let { path } = endpoint
        if (by === FindSummonerBy.ID) {
            path = path.replace("/$(by)/", "/")
        }
        return path
    }
    private genericRequest(
        by: FindSummonerBy,
        value: string,
        region: Regions,
    ): Promise<ApiResponseDTO<SummonerV4DTO>> {
        const endpoint = _.cloneDeep(endpointsV4.Summoner)
        endpoint.path = this.parsePath(endpoint, by)
        const params = {
            summonerName: value,
            by,
        }
        return this.request<SummonerV4DTO>(region, endpoint, params)
    }
    /**
     * Get by name
     * @param summonerName Summoner name
     * @param region Riot region
     */
    public async getByName(
        summonerName: string,
        region: Regions,
    ): Promise<ApiResponseDTO<SummonerV4DTO>> {
        return this.genericRequest(FindSummonerBy.NAME, summonerName, region)
    }
    /**
     * Get by id
     * @param id Summoner id
     * @param region Riot region
     */
    public async getById(id: string, region: Regions): Promise<ApiResponseDTO<SummonerV4DTO>> {
        return this.genericRequest(FindSummonerBy.ID, id, region)
    }
    /**
     * Get by PUUID
     * @param puuid
     * @param region Riot region
     */
    public async getByPUUID(
        puuid: string,
        region: Regions,
    ): Promise<ApiResponseDTO<SummonerV4DTO>> {
        return this.genericRequest(FindSummonerBy.PUUID, puuid, region)
    }
    /**
     * Get by PUUID
     * @param puuid
     * @param region Riot region
     */
    public async getByAccountID(
        accountId: string,
        region: Regions,
    ): Promise<ApiResponseDTO<SummonerV4DTO>> {
        return this.genericRequest(FindSummonerBy.ACCOUNT_ID, accountId, region)
    }
}
