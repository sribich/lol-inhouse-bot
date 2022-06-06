import { RegionGroups } from "../../../constants"
import { endpointsTFTV1 } from "../../../endpoints"
import { ApiResponseDTO } from "../../../models-dto"
import { MatchTFTDTO } from "../../../models-dto/matches/tft-matches/match-tft.dto"
import { MatchTFTQueryDTO } from "../../../models-dto/matches/tft-matches/match-tft-query.dto"
import { BaseApiTft } from "../base/base.api.tft"

export class MatchTFTApi extends BaseApiTft {
    // Public methods
    /**
     * Get match by id
     * @param matchId
     * @param region
     */
    public async get(matchId: string, region: RegionGroups): Promise<ApiResponseDTO<MatchTFTDTO>> {
        const params = {
            matchId,
        }
        return this.request<MatchTFTDTO>(region, endpointsTFTV1.Match, params)
    }

    /**
     * Get match listing
     * @param summonerPUUID
     * @param region
     */
    public async list(
        summonerPUUID: string,
        region: RegionGroups,
        query?: MatchTFTQueryDTO,
    ): Promise<ApiResponseDTO<string[]>> {
        const params = {
            summonerPUUID,
        }
        return this.request<string[]>(region, endpointsTFTV1.MatchListing, params, false, query)
    }

    /**
     * Get match listing (with details)
     */
    public async listWithDetails(
        summonerPUUID: string,
        region: RegionGroups,
        query?: MatchTFTQueryDTO,
    ): Promise<MatchTFTDTO[]> {
        const response: MatchTFTDTO[] = []
        // Match list
        const { response: ids } = await this.list(summonerPUUID, region, query)
        // Load details
        for (const id of ids) {
            const { response: match } = await this.get(id, region)
            response.push(match)
        }

        return response
    }
}
