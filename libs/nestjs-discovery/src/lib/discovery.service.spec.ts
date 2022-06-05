import { Controller, CustomDecorator, Get, Injectable, Module, SetMetadata } from "@nestjs/common"
import { PATH_METADATA } from "@nestjs/common/constants"
import { Test, TestingModule } from "@nestjs/testing"

import { DiscoveryModule } from "./discovery.module"
import { DiscoveryService } from "./discovery.service"
import { withMetaAtKey } from "./discovery.util"

const TestClassSymbol = Symbol("TestClassSymbol")
const TestMethodSymbol = Symbol("TestMethodSymbol")
const TestProviderSymbol = Symbol("TestProviderSymbol")

const TestClassDecorator = (config: string): CustomDecorator<unknown> =>
    SetMetadata(TestClassSymbol, config)

const TestMethodDecorator = (config: string): CustomDecorator<unknown> =>
    SetMetadata(TestMethodSymbol, config)

@Injectable()
@TestClassDecorator("class")
class TestService {
    @TestMethodDecorator("test provider method meta")
    specialMethod(): void {
        return
    }

    anotherMethod(): void {
        return
    }
}

@Controller("test")
class TestController {
    constructor(public readonly testService: TestService) {}
    public hello = "world"

    @Get("route")
    @TestMethodDecorator("test controller method meta")
    public get(): number {
        return 42
    }
}

@Module({
    providers: [
        TestService,
        {
            provide: TestProviderSymbol,
            useValue: null,
        },
    ],
    controllers: [TestController],
})
class TestModule {}

describe("DiscoveryService", () => {
    let app: TestingModule
    let discoveryService: DiscoveryService

    beforeEach(async () => {
        app = await Test.createTestingModule({
            imports: [DiscoveryModule, TestModule],
        }).compile()

        await app.init()

        discoveryService = app.get<DiscoveryService>(DiscoveryService)
    })

    describe("Controlelrs", () => {
        it("should discover controllers", async () => {
            const controllers = await discoveryService.controllers(() => true)

            expect(controllers).toHaveLength(1)

            const [controller] = controllers

            expect(controller.injectType).toBe(TestController)
            expect(controller.instance).toBeInstanceOf(TestController)

            const exampleController = controller.instance as TestController

            expect(exampleController.testService).toBeInstanceOf(TestService)
            expect(exampleController.hello).toBe("world")
        })

        it("should discover controller method handler meta based on a metadata key", async () => {
            const controllerMethodMeta = await discoveryService.controllerMethods(PATH_METADATA)

            const [first] = controllerMethodMeta

            expect(first).toBeDefined()
            expect(controllerMethodMeta.length).toBe(1)

            const meta = controllerMethodMeta[0]

            expect(meta).toMatchObject({
                metadata: "route",
                discoveredMethod: {
                    methodName: "get",
                    parentClass: {
                        injectType: TestController,
                        dependencyType: TestController,
                        parentModule: {
                            name: "TestModule",
                            dependencyType: TestModule,
                            injectType: TestModule,
                        },
                    },
                },
            })

            expect(meta.discoveredMethod.parentClass.instance).toBeInstanceOf(TestController)
        })
    })

    describe("Providers", () => {
        it("should be tolerant of potentially null providers", async () => {
            const providers = await discoveryService.providers(withMetaAtKey(TestClassSymbol))

            expect(providers).toBeDefined()

            const nullProvider = app.get(TestProviderSymbol)
            expect(nullProvider).toBeNull()
        })

        it("should discover providers based on a metadata key", async () => {
            const providers = await discoveryService.providers(withMetaAtKey(TestClassSymbol))

            expect(providers).toHaveLength(1)

            const [provider] = providers

            expect(provider.injectType).toBe(TestService)
            expect(provider.instance).toBeInstanceOf(TestService)
        })

        it("should discover provider method handler meta based on a metadata key", async () => {
            const providerMethodMeta = await discoveryService.providerMethods(TestMethodSymbol)

            expect(providerMethodMeta.length).toBe(1)

            const meta = providerMethodMeta[0]

            expect(meta).toMatchObject({
                metadata: "test provider method meta",
                discoveredMethod: {
                    methodName: "specialMethod",
                    parentClass: {
                        injectType: TestService,
                        dependencyType: TestService,
                        parentModule: {
                            name: "TestModule",
                            dependencyType: TestModule,
                            injectType: TestModule,
                        },
                    },
                },
            })

            expect(meta.discoveredMethod.parentClass.instance).toBeInstanceOf(TestService)
        })
    })
})
