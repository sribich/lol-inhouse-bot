import { Logger, ValidationPipe } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { NestFactory } from "@nestjs/core"
import compression from "compression"
import helmet from "helmet"

import { AppModule } from "./app.module"
import { EnvironmentVariables } from "./environment"

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true
    })

    app.use(compression())
    app.use(helmet())

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
                excludeExtraneousValues: true,
            }
        })
    )

    app.enableShutdownHooks()

    const service = app.get(ConfigService) as ConfigService<EnvironmentVariables>
    const port = service.get("APP_PORT")

    await app.listen(port)

    Logger.log(`🚀 Application is running on: http://localhost:${port}`)
}

bootstrap().catch((error) => {
    Logger.error(`❌  Error starting server, ${error}`)
    throw error
})
