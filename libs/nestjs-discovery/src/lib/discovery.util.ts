import { DiscoveredClass, Filter, MetadataKey } from "./discovery.types"

const notNull = <TValue>(value: TValue | null | undefined): value is TValue => {
    if (value === null || value === undefined) {
        return false
    }

    // This line gives the type system an explicit type to
    // check on compile.
    const _testDummy: TValue = value
    return true
}

/**
 * A filter that can be used to search for DiscoveredClasses in an App that contain meta attached to a
 * certain key
 */
export const withMetaAtKey: (key: MetadataKey) => Filter<DiscoveredClass> =
    (key) => (component: DiscoveredClass) => {
        const targets = [component?.instance?.constructor, component?.injectType]

        return targets.filter(notNull).some((it) => Reflect.getMetadata(key, it))
    }
