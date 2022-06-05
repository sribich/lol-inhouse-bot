import { ConfigType } from "./app-config.types"

export const appConfigs = {
    inhouse_category_id: {
        type: ConfigType.String,
    },
    inhouse_mod_role_id: {
        type: ConfigType.String,
    },
    // Used temporarily to please the type system when matching over
    // known config types, as typescript will only infer the types that
    // actually exist and not all possible types.
    string_placeholder: {
        type: ConfigType.String,
    },
    boolean_placeholder: {
        type: ConfigType.Boolean,
    },
    number_placeholder: {
        type: ConfigType.Number,
    },
} as const

export type AppConfigs = typeof appConfigs
