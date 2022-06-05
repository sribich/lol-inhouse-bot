import { Injectable, Scope } from "@nestjs/common"
import { MetadataScanner, ModulesContainer } from "@nestjs/core"
import { STATIC_CONTEXT } from "@nestjs/core/injector/constants"
import { InstanceWrapper } from "@nestjs/core/injector/instance-wrapper"
import { Module } from "@nestjs/core/injector/module"

import {
    DiscoveredClass,
    DiscoveredClassWithMetadata,
    DiscoveredMethodWithMetadata,
    Filter,
    MetadataKey,
} from "./discovery.types"

export const getComponentMetaAtKey = <T>(
    key: MetadataKey,
    component: DiscoveredClass,
): T | undefined => {
    const dependencyMeta = Reflect.getMetadata(key, component.dependencyType) as T

    if (dependencyMeta) {
        return dependencyMeta
    }

    if (component.injectType != null) {
        return Reflect.getMetadata(key, component.injectType) as T
    }
}

export const withMetaAtKey: (key: MetadataKey) => Filter<DiscoveredClass> =
    (key) => (component) => {
        // eslint-disable-next-line @typescript-eslint/ban-types
        const metaTargets: Function[] = [
            component?.instance?.constructor,
            // eslint-disable-next-line @typescript-eslint/ban-types
            component.injectType as Function,
        ].filter((x) => x != null)

        return metaTargets.some((it) => Reflect.getMetadata(key, it))
    }

@Injectable()
export class DiscoveryService {
    private hasDiscoveryBeenRun = false
    private discoveredControllers: DiscoveredClass[] = []
    private discoveredProviders: DiscoveredClass[] = []

    constructor(
        private readonly modulesContainer: ModulesContainer,
        private readonly metadataScanner: MetadataScanner,
    ) {}

    /**
     * Returns all controllers in the Nest application that match
     * the provided filter.
     */
    async controllers(filter: Filter<DiscoveredClass>): Promise<DiscoveredClass[]> {
        await this.discover()

        return this.discoveredControllers.filter(filter)
    }

    /**
     * Returns all providers in the Nest application that match
     * the provided filter.
     */
    async providers(filter: Filter<DiscoveredClass>): Promise<DiscoveredClass[]> {
        await this.discover()

        return this.discoveredProviders.filter(filter)
    }

    async controllersWithMeta<T>(
        metadataKey: MetadataKey,
    ): Promise<DiscoveredClassWithMetadata<T>[]> {
        const controllers = await this.controllers(withMetaAtKey(metadataKey))

        return controllers.map((it) => ({
            metadata: getComponentMetaAtKey<T>(metadataKey, it) as T,
            discoveredClass: it,
        }))
    }

    async providersWithMeta<T>(
        metadataKey: MetadataKey,
    ): Promise<DiscoveredClassWithMetadata<T>[]> {
        const providers = await this.providers(withMetaAtKey(metadataKey))

        return providers.map((it) => ({
            metadata: getComponentMetaAtKey<T>(metadataKey, it) as T,
            discoveredClass: it,
        }))
    }

    async controllerMethods<T>(
        metadataKey: MetadataKey,
        filter: Filter<DiscoveredClass> = () => true,
    ): Promise<DiscoveredMethodWithMetadata<T>[]> {
        const controllers = await this.controllers(filter)
        const methods = []

        for (const controller of controllers) {
            methods.push(...this.classMethods<T>(controller, metadataKey))
        }

        return methods
    }

    async providerMethods<T>(
        metadataKey: MetadataKey,
        filter: Filter<DiscoveredClass> = () => true,
    ): Promise<DiscoveredMethodWithMetadata<T>[]> {
        const providers = await this.providers(filter)
        const methods = []

        for (const provider of providers) {
            methods.push(...this.classMethods<T>(provider, metadataKey))
        }

        return methods
    }

    private classMethods<T>(
        klass: DiscoveredClass,
        metadataKey: MetadataKey,
    ): DiscoveredMethodWithMetadata<T>[] {
        const { instance } = klass

        if (!instance) {
            return []
        }

        const prototype = Object.getPrototypeOf(instance)

        return this.metadataScanner
            .scanFromPrototype(instance, prototype, (methodName) => {
                const handler = prototype[methodName]
                const metadata: T = Reflect.getMetadata(metadataKey, handler)

                return {
                    metadata,
                    discoveredMethod: {
                        handler,
                        methodName,
                        parentClass: klass,
                    },
                }
            })
            .filter((klass) => !!klass.metadata)
    }

    /**
     * Aggregates all visible controllers and providers available to the
     * module.
     *
     * Components that are REQUEST scoped are strongly linked to a given
     * HTTP request. We cannot, therefore, make any strong guarantees of
     * the lifetime of a request. We opt to solve this by preventing the
     * discovery of REQUEST scoped components.
     */
    private async discover(): Promise<void> {
        if (this.hasDiscoveryBeenRun) {
            return
        }

        this.hasDiscoveryBeenRun = true

        for (const module of this.modulesContainer.values()) {
            const controllers = [...module.controllers.values()]
            const providers = [...module.providers.values()]

            this.discoveredControllers.push(
                ...(await Promise.all(
                    controllers
                        .filter((component) => component.scope !== Scope.REQUEST)
                        .map((component) => this.toDiscoveredClass(module, component)),
                )),
            )

            this.discoveredProviders.push(
                ...(await Promise.all(
                    providers
                        .filter((component) => component.scope !== Scope.REQUEST)
                        .map((component) => this.toDiscoveredClass(module, component)),
                )),
            )
        }
    }

    private async toDiscoveredClass(
        module: Module,
        wrapper: InstanceWrapper,
    ): Promise<DiscoveredClass> {
        const instanceHost = wrapper.getInstanceByContextId(STATIC_CONTEXT, wrapper.id)

        if (instanceHost.isPending && !instanceHost.isResolved) {
            await instanceHost.donePromise
        }

        return {
            name: wrapper.name,
            instance: instanceHost.instance,
            injectType: wrapper.metatype,
            dependencyType: instanceHost?.instance?.constructor,
            parentModule: {
                name: module.metatype.name,
                instance: module.instance,
                injectType: module.metatype,
                dependencyType: module.instance.constructor,
            },
        }
    }
}
