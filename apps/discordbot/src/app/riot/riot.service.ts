import { LolApi } from "@inhouse/twisted"
import { Injectable } from "@nestjs/common"

@Injectable()
export class RiotService {
    public api: LolApi
    public tournaments: LolApi

    constructor() {
        this.api = new LolApi()
        this.tournaments = new LolApi()
    }
}
