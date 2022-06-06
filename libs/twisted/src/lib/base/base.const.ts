export enum BaseConstants {
    RATE_LIMIT = 1,
    RETRY_ATTEMPTS = 1,
    SERVICE_UNAVAILABLE = 4,
    /** $(region) can be Regions or RegionGroups, depending on api version. */
    BASE_URL = "https://$(region).api.riotgames.com/:game",
}

export enum BaseApiGames {
    LOL = "lol",
    TFT = "tft",
}
