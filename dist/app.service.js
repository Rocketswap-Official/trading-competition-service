"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const config_1 = require("./config");
const competition_entity_1 = require("./entities/competition.entity");
const trade_history_entity_1 = require("./entities/core/trade-history.entity");
const user_result_entity_1 = require("./entities/user-result.entity");
const logger_1 = require("./utils/logger");
const fs = require("fs");
let AppService = class AppService {
    async onModuleInit() {
        await competition_entity_1.CompetitionEntity.clear();
        await user_result_entity_1.UserResultEntity.clear();
        await this.loadCompetitions();
        this.createUpdateCompStatsTimer();
    }
    createUpdateCompStatsTimer() {
        const timer = setTimeout(async () => {
            await this.updateCompStats();
            this.createUpdateCompStatsTimer();
        }, config_1.config.frequency);
    }
    async updateCompStats() {
        logger_1.log.log(`updating comp stats`);
        const active_comps = await (0, competition_entity_1.findActiveCompetitions)();
        for (let comp of active_comps) {
            logger_1.log.log(`updating stats for competition.id : ${comp.id}, ${comp.comp_contract_title}/${comp.reward_contract_title}`);
            const trades = await trade_history_entity_1.TradeHistoryEntity.find({ where: { time: (0, typeorm_1.Between)(comp.date_start_unix / 1000, comp.date_end_unix / 1000), contract_name: comp.comp_contract } });
            const volume_by_vk = trades.reduce((accum, trade) => {
                accum[trade.vk] = accum[trade.vk] ? accum[trade.vk] + (Number(trade.amount) * Number(trade.price)) : Number(trade.amount) * Number(trade.price);
                return accum;
            }, {});
            const results_to_save = [];
            const existing_user_results = await user_result_entity_1.UserResultEntity.find({ where: { competition_id: comp.id } });
            for (let key of Object.keys(volume_by_vk)) {
                let entity = existing_user_results.find(r => r.user_vk === key);
                if (!entity) {
                    entity = new user_result_entity_1.UserResultEntity();
                    entity.user_vk = key;
                    entity.competition_id = comp.id;
                    logger_1.log.log(key);
                    logger_1.log.log(volume_by_vk[key]);
                    entity.volume_tau = volume_by_vk[key];
                    results_to_save.push(entity);
                }
                else if (entity.volume_tau !== volume_by_vk[key]) {
                    entity.volume_tau = volume_by_vk[key];
                    results_to_save.push(entity);
                }
                await user_result_entity_1.UserResultEntity.save(results_to_save);
            }
        }
    }
    async loadCompetitions() {
        logger_1.log.log(`loading competition data`);
        const path = `./src/competitions.json`;
        const competition_data = await new Promise((resolve, reject) => {
            fs.readFile(path, (err, data) => {
                if (err)
                    reject(err);
                else
                    resolve(JSON.parse(data));
            });
        }).catch((err) => {
            logger_1.log.log(`error loading file !`);
        });
        await (0, competition_entity_1.createCompetitions)(competition_data);
    }
};
AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map