export type AppConfigModuleConfig = {
    [key: string]: AppConfigType
}

export type AppConfigType =
    | { type: ConfigType.Boolean; defaultValue?: boolean }
    | { type: ConfigType.String; defaultValue?: string }
    | { type: ConfigType.Number; defaultValue?: number }

export enum ConfigType {
    Boolean = "bool",
    String = "string",
    Number = "number",
}

export type TypeMap = {
    bool: boolean
    string: string
    number: number
}
