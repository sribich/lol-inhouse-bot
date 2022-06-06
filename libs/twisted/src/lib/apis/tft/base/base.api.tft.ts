import { BaseApi } from "../../../base/base"
import { BaseApiGames } from "../../../base/base.const"
import { RegionGroups, Regions } from "../../../constants"

export class BaseApiTft extends BaseApi<RegionGroups | Regions> {
    protected readonly game: BaseApiGames = BaseApiGames.TFT
}
