import { NOT_FOUND } from "http-status-codes"

import { RegionGroups } from "../../../constants"
import { endpointsV5 } from "../../../endpoints/endpoints"
import { GenericError } from "../../../errors"
import { ApiResponseDTO } from "../../../models-dto"
import { MatchV5DTOs, MatchV5TimelineDTOs } from "../../../models-dto/matches/match-v5"
import { MatchQueryV5DTO } from "../../../models-dto/matches/query-v5"
import { BaseApiLol } from "../base/base.api.lol"

/**
 * Match methods
 */
export class MatchV5Api extends BaseApiLol {
    // Private methods
    private generateResponse(error: GenericError): ApiResponseDTO<string[]> {
        return {
            rateLimits: error.rateLimits,
            response: [],
        }
    }

    /**
     * Get match details
     * @param matchId Match id
     * @param region
     */
    public async get(
        matchId: string,
        region: RegionGroups,
    ): Promise<ApiResponseDTO<MatchV5DTOs.MatchDto>> {
        const params = {
            matchId,
        }
        return await this.request<MatchV5DTOs.MatchDto>(region, endpointsV5.Match, params)
    }
    /**
     * Summoner match listing
     * @param puuid Puuid
     * @param region
     * @returns A list of match ids
     */
    public async list(
        puuid: string,
        region: RegionGroups,
        query?: MatchQueryV5DTO,
    ): Promise<ApiResponseDTO<string[]>> {
        const params = {
            summonerPUUID: puuid,
        }
        try {
            return await this.request<string[]>(
                region,
                endpointsV5.MatchListing,
                params,
                false,
                query,
            )
        } catch (e) {
            if (!(e instanceof GenericError) || e.status !== NOT_FOUND) {
                throw e
            }
            return this.generateResponse(e)
        }
    }

    public async timeline(
        matchId: string,
        region: RegionGroups,
    ): Promise<ApiResponseDTO<MatchV5TimelineDTOs.MatchTimelineDto>> {
        const params = {
            matchId,
        }
        return this.request<MatchV5TimelineDTOs.MatchTimelineDto>(
            region,
            endpointsV5.MatchTimeline,
            params,
        )
    }
}
