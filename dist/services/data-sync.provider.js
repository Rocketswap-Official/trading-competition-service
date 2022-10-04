"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DataSyncProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSyncProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("../config");
const last_block_entity_1 = require("../entities/core/last-block.entity");
const pair_entity_1 = require("../entities/core/pair.entity");
const trade_history_entity_1 = require("../entities/core/trade-history.entity");
const blockservice_utils_1 = require("../utils/blockservice-utils");
const logger_1 = require("../utils/logger");
const misc_utils_1 = require("../utils/misc-utils");
const socket_client_provider_1 = require("./socket-client.provider");
let DataSyncProvider = DataSyncProvider_1 = class DataSyncProvider {
    constructor() {
        this.parseBlock = async (block) => {
            const { state, fn, timestamp, hash } = block;
            try {
                const amm_state_changes = state.filter((s) => s.key.split(".")[0] === (0, config_1.getConfig)().amm_contract);
                if (!amm_state_changes.length)
                    return;
                const currency_state_change = state.find(s => s.key.split(":")[0] === "currency.balances" && s.key.split(":")[1] !== config_1.config.amm_contract);
                const user_vk = currency_state_change.key.split(":")[1];
                await this.processAmmBlock({
                    state: amm_state_changes,
                    hash,
                    timestamp,
                    user_vk
                });
            }
            catch (err) {
                logger_1.log.log({ err });
            }
        };
        this.processAmmBlock = async (args) => {
            const { state, hash, timestamp, user_vk } = args;
            try {
                await (0, pair_entity_1.savePair)({
                    state,
                });
                await DataSyncProvider_1.updateTokenList();
                await saveTrade(state, hash, timestamp, user_vk);
                await (0, pair_entity_1.updatePairReserves)(state);
            }
            catch (err) {
                logger_1.log.log({ err });
            }
        };
    }
    static get token_list() {
        return DataSyncProvider_1.token_contract_list;
    }
    async onModuleInit() {
        const last_block_saved_db = await (0, last_block_entity_1.getLastProcessedBlock)();
        await (0, blockservice_utils_1.syncAmmCurrentState)();
        if (!last_block_saved_db) {
            await (0, blockservice_utils_1.syncTradeHistory)(config_1.config.starting_tx_id);
        }
        else {
            logger_1.log.log(`last block ${last_block_saved_db} detected in local db.`);
            await (0, blockservice_utils_1.fillBlocksSinceSync)(last_block_saved_db, this.parseBlock);
        }
        await DataSyncProvider_1.updateTokenList();
        (0, socket_client_provider_1.initSocket)(this.parseBlock);
        (0, last_block_entity_1.startTrimLastBlocksTask)();
    }
};
DataSyncProvider.token_contract_list = [];
DataSyncProvider.updateTokenList = async () => {
    const token_list_update = await (0, pair_entity_1.getTokenList)();
    DataSyncProvider_1.token_contract_list = token_list_update;
};
DataSyncProvider = DataSyncProvider_1 = __decorate([
    (0, common_1.Injectable)()
], DataSyncProvider);
exports.DataSyncProvider = DataSyncProvider;
const saveTrade = async (state, hash, timestamp, user_vk) => {
    logger_1.log.log({ state });
    const traded_tokens = state.filter(s => s.key.includes("prices"));
    if (!traded_tokens.length)
        return;
    for (let token of traded_tokens) {
        const contract_name = token.key.split(":")[1];
        const price = (0, misc_utils_1.getVal)(traded_tokens.find(s => s.key.includes(contract_name)));
        const reserves = state.find(s => s.key.includes('reserves') && s.key.includes(contract_name)).value;
        await processTrade(contract_name, reserves, price, hash, timestamp, user_vk);
    }
};
const processTrade = async (contract_name, reserves, price, hash, timestamp, vk) => {
    const pair = await pair_entity_1.PairEntity.findOne(contract_name);
    const pair_reserves_old = [Number(pair.reserves[0]), Number(pair.reserves[1])];
    const pair_reserves_new = [Number((0, misc_utils_1.getValue)(reserves[0])), Number((0, misc_utils_1.getValue)(reserves[1]))];
    const type = pair_reserves_old[0] < pair_reserves_new[0] ? "buy" : "sell";
    const dif = pair_reserves_old[1] - pair_reserves_new[1];
    const volume = dif > 0 ? dif : dif * -1;
    await (0, trade_history_entity_1.saveTradeUpdate)({ contract_name, price, amount: String(volume), type, time: timestamp, hash, vk });
};
//# sourceMappingURL=data-sync.provider.js.map