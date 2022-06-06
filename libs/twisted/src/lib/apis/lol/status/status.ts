import { Regions } from "../../../constants"
import { endpointsV3 } from "../../../endpoints"
import { ApiResponseDTO, LolStatusDTO } from "../../../models-dto"
import { BaseApiLol } from "../base/base.api.lol"

export class StatusApi extends BaseApiLol {
    /**
     * Lol status by server
     * @param region Riot region
     */
    public async get(region: Regions): Promise<ApiResponseDTO<LolStatusDTO>> {
        return this.request<LolStatusDTO>(region, endpointsV3.LolStatus)
    }
}
