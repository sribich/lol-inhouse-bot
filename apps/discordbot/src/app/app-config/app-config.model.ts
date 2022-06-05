import { Config as PrismaConfig } from "@inhouse/database"
import { IsEnum } from "class-validator"

import { ConfigType } from "./app-config.types"

export class Config implements PrismaConfig {
    id!: number

    name!: string

    @IsEnum(ConfigType)
    type!: ConfigType

    value!: string
}
