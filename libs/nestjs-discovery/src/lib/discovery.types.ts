import { Type } from "@nestjs/common"

export type DiscoveredModule<T extends object = object> = {
    name: string
    instance: T
    // eslint-disable-next-line @typescript-eslint/ban-types
    injectType?: Function | Type
    // eslint-disable-next-line @typescript-eslint/ban-types
    dependencyType: Function | Type<T>
}

export type DiscoveredClass = DiscoveredModule & {
    parentModule: DiscoveredModule
}

export type DiscoveredClassWithMetadata<T> = {
    discoveredClass: DiscoveredClass
    metadata: T
}

export type DiscoveredMethod = {
    parentClass: DiscoveredClass
    methodName: string
    handler: (...args: unknown[]) => unknown
}

export type DiscoveredMethodWithMetadata<T> = {
    discoveredMethod: DiscoveredMethod
    metadata: T
}

export type MetadataKey = string | number | symbol
export type Filter<T> = (item: T) => boolean
