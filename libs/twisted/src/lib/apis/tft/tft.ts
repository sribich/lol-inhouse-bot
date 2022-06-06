import { BaseApiTft } from "./base/base.api.tft"
import { LeagueTFTApi } from "./league/league.tft"
import { MatchTFTApi } from "./match/match.tft"
import { TFTStaticFiles } from "./static/static"
import { SummonerTftApi } from "./summoner/summoner"

/**
 * TFT Api
 */
export class TftApi extends BaseApiTft {
    /**
     * Match methods
     */
    public readonly Match = new MatchTFTApi(this.getParam())
    /**
     * Summoner methods
     */
    public readonly Summoner = new SummonerTftApi(this.getParam())
    /**
     * League methods
     */
    public readonly League = new LeagueTFTApi(this.getParam())
    /**
     * Static files
     */
    public readonly StaticFiles = new TFTStaticFiles()
}
