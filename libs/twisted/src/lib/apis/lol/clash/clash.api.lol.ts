import { Regions } from "../../../constants"
import { endpointsClashV1 } from "../../../endpoints"
import { ApiResponseDTO } from "../../../models-dto"
import { ClashPlayerDTO } from "../../../models-dto/clash/player.clash.dto"
import { ClashTeamDto } from "../../../models-dto/clash/team.clash.dto"
import { TournamentClashDTO } from "../../../models-dto/clash/tournament/tournament.clash.dto"
import { BaseApiLol } from "../base/base.api.lol"

/**
 * Clash api methods
 */
export class ClashApi extends BaseApiLol {
    /**
     * This endpoint returns a list of active Clash players for a given summoner ID. If a summoner registers for multiple tournaments at the same time (e.g., Saturday and Sunday) then both registrations would appear in this list.
     * @param region
     * @param summonerId Encrypted summoner id
     */
    playersList(
        encryptedSummonerId: string,
        region: Regions,
    ): Promise<ApiResponseDTO<ClashPlayerDTO[]>> {
        return this.request<ClashPlayerDTO[]>(region, endpointsClashV1.GetPlayers, {
            encryptedSummonerId,
        })
    }
    /**
     * Get team by id
     * @param region
     * @param teamId Team id
     */
    getTeamById(teamId: string, region: Regions): Promise<ApiResponseDTO<ClashTeamDto>> {
        return this.request<ClashTeamDto>(region, endpointsClashV1.GetTeam, { teamId })
    }
    /**
     * Returns a list of active and upcoming tournaments.
     * @param region
     */
    getTournaments(region: Regions): Promise<ApiResponseDTO<TournamentClashDTO[]>> {
        return this.request<TournamentClashDTO[]>(region, endpointsClashV1.GetTournaments)
    }
    /**
     * Get team tournament
     */
    getTeamTournament(
        teamId: string,
        region: Regions,
    ): Promise<ApiResponseDTO<TournamentClashDTO>> {
        return this.request<TournamentClashDTO>(region, endpointsClashV1.GetTournamentByTeamId, {
            teamId,
        })
    }
    /**
     * Get tournament by id
     */
    getTournamentById(
        tournamentId: string | number,
        region: Regions,
    ): Promise<ApiResponseDTO<TournamentClashDTO>> {
        return this.request<TournamentClashDTO>(region, endpointsClashV1.GetTournamentById, {
            tournamentId,
        })
    }
}
