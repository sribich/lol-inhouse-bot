import { Regions } from "../../../constants"
import { endpointsTFTV1 } from "../../../endpoints"
import { ApiResponseDTO, LeagueListDTO } from "../../../models-dto"
import { LeagueEntryDTO } from "../../../models-dto/league/tft-league"
import { BaseApiTft } from "../base/base.api.tft"

export class LeagueTFTApi extends BaseApiTft {
    // Public methods
    /**
     * Get league entries for a given summoner ID
     * @param encryptedSummonerId
     * @param region
     */
    public async get(
        encryptedSummonerId: string,
        region: Regions,
    ): Promise<ApiResponseDTO<LeagueEntryDTO[]>> {
        const params = {
            encryptedSummonerId,
        }
        return this.request<LeagueEntryDTO[]>(region, endpointsTFTV1.LeagueBySummoner, params)
    }
    /**
     * Get the master league
     * @param region
     */
    public async getMasterLeague(region: Regions): Promise<ApiResponseDTO<LeagueListDTO>> {
        return this.request<LeagueListDTO>(region, endpointsTFTV1.LeagueMaster)
    }
    /**
     * Get the grandmaster league
     * @param region
     */
    public async getGrandMasterLeague(region: Regions): Promise<ApiResponseDTO<LeagueListDTO>> {
        return this.request<LeagueListDTO>(region, endpointsTFTV1.LeagueGrandMaster)
    }
    /**
     * Get the challenger league
     * @param region
     */
    public async getChallengerLeague(region: Regions): Promise<ApiResponseDTO<LeagueListDTO>> {
        return this.request<LeagueListDTO>(region, endpointsTFTV1.LeagueChallenger)
    }
}
