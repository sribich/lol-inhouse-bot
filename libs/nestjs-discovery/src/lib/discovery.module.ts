import { Module } from "@nestjs/common"
import { MetadataScanner } from "@nestjs/core"

import { DiscoveryService } from "./discovery.service"

@Module({
    providers: [DiscoveryService, MetadataScanner],
    exports: [DiscoveryService],
})
export class DiscoveryModule {}
