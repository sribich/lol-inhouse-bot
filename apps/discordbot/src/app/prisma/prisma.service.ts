import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PrismaClient } from "database"

import { EnvironmentVariables } from "../../environment"

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    private database: PrismaClient

    constructor(private configService: ConfigService<EnvironmentVariables>) {
        const databaseUrl = this.configService.get("DATABASE_URL")

        this.database = new PrismaClient({
            datasources: {
                db: {
                    url: databaseUrl,
                },
            },
        })
    }

    async onModuleInit(): Promise<void> {
        await this.database.$connect()
    }

    async onModuleDestroy(): Promise<void> {
        await this.database.$disconnect()
    }
}
