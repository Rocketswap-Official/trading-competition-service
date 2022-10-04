"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const competition_entity_1 = require("./entities/competition.entity");
const last_block_entity_1 = require("./entities/core/last-block.entity");
const lp_points_entity_1 = require("./entities/core/lp-points.entity");
const pair_entity_1 = require("./entities/core/pair.entity");
const trade_history_entity_1 = require("./entities/core/trade-history.entity");
const user_result_entity_1 = require("./entities/user-result.entity");
const block_service_1 = require("./services/block.service");
const data_sync_provider_1 = require("./services/data-sync.provider");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'sqlite',
                database: 'db.sqlite',
                entities: [last_block_entity_1.LastBlockEntity, pair_entity_1.PairEntity, trade_history_entity_1.TradeHistoryEntity, lp_points_entity_1.LpPointsEntity, competition_entity_1.CompetitionEntity, user_result_entity_1.UserResultEntity],
                synchronize: true,
                autoLoadEntities: true
            }),
        ], controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, data_sync_provider_1.DataSyncProvider, block_service_1.BlockService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map