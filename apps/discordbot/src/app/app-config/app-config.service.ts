import { Injectable, Logger } from "@nestjs/common"
import { ClassConstructor, plainToClass } from "class-transformer"

import { KeyOf } from "../../utils/types"
import { PrismaService } from "../prisma/prisma.service"
import { AppConfigs, appConfigs } from "./app-config.constants"
import { Config } from "./app-config.model"
import { ConfigType, TypeMap } from "./app-config.types"

const wrap = <T, U, K>(
    it: (t: T) => Promise<U>,
    type: ClassConstructor<K>,
): ((t: T) => Promise<K>) => {
    return async (t: T): Promise<K> => {
        const result = await it(t)

        return plainToClass(type, result)
    }
}
const wrapNullable = <T, U, K>(
    it: (t: T) => Promise<U>,
    type: ClassConstructor<K>,
): ((t: T) => Promise<K | null>) => {
    return async (t: T): Promise<K | null> => {
        const result = await it(t)

        return result ? plainToClass(type, result) : null
    }
}

@Injectable()
export class AppConfigService {
    private logger = new Logger(AppConfigService.name)

    constructor(private prismaService: PrismaService) {}

    private create = wrap(this.prismaService.database.config.create, Config)
    private findUnique = wrapNullable(this.prismaService.database.config.findUnique, Config)

    private upsert = wrap(this.prismaService.database.config.upsert, Config)

    /**
     * Returns an existing `Config`, throwing an exception if it does
     * not exist.
     *
     * In all external calling code, this function **should** be guarded
     * by a `hasConfig` call. Please see the below examples for what to
     * expect when a config does not exist.
     *
     * ## Example
     *
     * ```ts
     * await appConfigService.createConfig("enableFeature", "foo")
     *
     * const c1 = await appConfigService.getConfig("enableFeature")
     * expect(c1.value).toEqual("foo")
     *
     * const c2 = async (): Promise<Config> => await appConfigService.getConfig("doesNotExist")
     * expect(c2).rejects.toThrowError("Config 'doesNotExist' does not exist.")
     * ```
     *
     * ## Throws
     *
     * - **`Error`** when the config `name` does not exist
     */
    async getConfig(configName: KeyOf<AppConfigs>): Promise<Config> {
        const config = await this.findUnique({
            where: { name: configName },
        })

        if (!config) {
            throw new Error(`Config '${configName}' does not exist.`)
        }

        return config
    }

    /**
     * Checks whether the given `configName` has already been created.
     *
     * # Example
     *
     * ```ts
     * await appConfigService.createConfig("enableFeature", "foo")
     *
     * const c1 = await appConfigService.hasConfig("enableFeature")
     * expect(c1).toEqual(true)
     *
     * const c2 = await appConfigService.hasConfig("doesNotExist")
     * expect(c2).toEqual(false)
     * ```
     */
    async hasConfig(configName: KeyOf<AppConfigs>): Promise<boolean> {
        const config = await this.findUnique({
            where: { name: configName },
        })

        return config !== null
    }

    /**
     * Creates a new database-backed `Config` instance.
     *
     * # Example
     *
     * ```ts
     * const c1 = await appConfigService.createConfig("enableFeature", "foo")
     * expect(c1.value).toEqual("foo")
     *
     * const c2 = async (): Promise<Config> => await appConfigService.createConfig("enableFeature", "bar")
     * expect(c2).rejects.toThrowError("Attempted to create duplicate config 'enableFeature'.")
     *
     * const c3 = await appConfigService.createConfig("booleanValue", true)
     * expect(c3.value).toEqual("true")
     *
     * const c4 = async (): Promise<Config> => await appConfigService.createConfig("otherBooleanValue", "true")
     * expect(c4).rejects.toThrowError("Failed to serialize config 'otherBooleanValue'. The provided value is not a valid 'boolean' type.")
     * ```
     *
     * # Throws
     *
     * - **`Error`** when the config `value` is invalid for the given config `type`
     * - **`Error`** when the config `name` already exists
     */
    async createConfig<K extends KeyOf<AppConfigs>>(
        configName: K,
        configValue: TypeMap[AppConfigs[K]["type"]],
    ): Promise<Config> {
        if (await this.hasConfig(configName)) {
            throw new Error(`Attempted to create duplicate config '${configName}'.`)
        }

        const type = this.getType(configName)
        const value = await this.serialize(configName, configValue)

        return await this.create({
            data: {
                name: configName,
                type,
                value,
            },
        })
    }

    async getValue<K extends KeyOf<AppConfigs>>(
        configName: K,
    ): Promise<TypeMap[AppConfigs[K]["type"]]> {
        const config = await this.getConfig(configName)

        if (config.type !== appConfigs[configName].type) {
            throw new Error(
                `Type mismatch on config ${configName}. Expected ${appConfigs[configName].type}, got ${config.type}`,
            )
        }

        switch (config.type) {
            case ConfigType.Boolean:
                if (!["true", "false"].includes(config.value)) {
                    return Promise.reject(
                        new Error("Boolean type has invalid value. Expected 'true' or 'false'"),
                    )
                }

                return (config.value === "true") as TypeMap[AppConfigs[K]["type"]]
            case ConfigType.String:
                return config.value as TypeMap[AppConfigs[K]["type"]]
            case ConfigType.Number:
                return Number.parseInt(config.value) as TypeMap[AppConfigs[K]["type"]]
        }

        return Promise.reject(new Error(`Unknown config type ${config.type}`))
    }

    async createOrUpdate<K extends KeyOf<AppConfigs>>(
        configName: K,
        configValue: TypeMap[AppConfigs[K]["type"]],
    ): Promise<Config> {
        const type = this.getType(configName)
        const value = await this.serialize(configName, configValue)

        return await this.upsert({
            where: {
                name: configName,
            },
            create: {
                name: configName,
                type,
                value,
            },
            update: {
                value,
            },
        })
    }

    /**
     * Transforms a concrete type into a string value for
     * the underlying storage system.
     *
     * @example
     *
     * ```ts
     * //* Boolean
     * const v1 = this.serialize("booleanConfig", true)
     * expect(v1.unwrap()).toEqual("true")
     *
     * const v2 = this.serialize("booleanConfig", "true")
     * expect(v2.unwrapErr()).toEqual("Failed to validate config 'booleanConfig'. The passed value is not a valid 'boolean' type.")
     *
     * //* String
     * const v3 = this.serialize("stringConfig", "foo")
     * expect(v3.unwrap()).toEqual("foo")
     *
     * const v4 = this.serialize("stringConfig", 42)
     * expect(v4.unwrapErr()).toEqual("")
     * ```
     */
    private async serialize<K extends KeyOf<AppConfigs>>(
        configName: K,
        configValue: TypeMap[AppConfigs[K]["type"]],
    ): Promise<string> {
        const configType = appConfigs[configName].type

        switch (configType) {
            case ConfigType.Boolean: {
                if (configValue === true || configValue === false) {
                    return configValue.toString()
                }

                break
            }
            case ConfigType.String: {
                if (typeof configValue === "string") {
                    return configValue
                }

                break
            }
            case ConfigType.Number: {
                return configValue.toString()
            }
        }

        throw new Error(
            `Failed to serialize config '${configName}'. The provided value is not a valid '${configType}' type.`,
        )
    }

    /*
    private async parse<K extends KeyOf<T>>(
        configName: K,
        configValue: string,
    ): Result<TypeMap[T[K]["type"]] {

    }
    */

    private getType<K extends KeyOf<AppConfigs>>(configName: K): AppConfigs[K]["type"] {
        const type = appConfigs[configName]?.type

        if (!type) {
            throw new Error(
                `No type information available for config '${configName}'. Was this config added to the 'appConfig' definition?`,
            )
        }

        return type
    }
}
