"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveTradesToDb = exports.findLastMostRecentTradeFromDb = exports.findMostRecentTradeFromDb = exports.parseTrades = exports.saveTradeUpdate = exports.TradeHistoryEntity = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("../../config");
const logger_1 = require("../../utils/logger");
const misc_utils_1 = require("../../utils/misc-utils");
let TradeHistoryEntity = class TradeHistoryEntity extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", String)
], TradeHistoryEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TradeHistoryEntity.prototype, "contract_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], TradeHistoryEntity.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], TradeHistoryEntity.prototype, "time", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TradeHistoryEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TradeHistoryEntity.prototype, "vk", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TradeHistoryEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TradeHistoryEntity.prototype, "hash", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TradeHistoryEntity.prototype, "tx_uid", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], TradeHistoryEntity.prototype, "reserves", void 0);
TradeHistoryEntity = __decorate([
    (0, typeorm_1.Entity)()
], TradeHistoryEntity);
exports.TradeHistoryEntity = TradeHistoryEntity;
async function saveTradeUpdate(args) {
    const entity = new TradeHistoryEntity();
    for (let arg in args) {
        entity[arg] = args[arg];
    }
    logger_1.log.log({ args });
    logger_1.log.log("got to here");
    entity.time = args.time;
    await entity.save();
}
exports.saveTradeUpdate = saveTradeUpdate;
const parseTrades = async (history, contract_name, token_symbol) => {
    try {
        let most_recent_trade = await (0, exports.findMostRecentTradeFromDb)(contract_name);
        const most_recent_trade_uid = most_recent_trade ? most_recent_trade.tx_uid : "0";
        let last_most_recent_trade;
        if (most_recent_trade) {
            last_most_recent_trade = await (0, exports.findLastMostRecentTradeFromDb)(contract_name);
        }
        const trade_transactions = history.filter((item) => {
            return (item.affectedRootKeysList.includes(`${config_1.config.amm_contract}.reserves:${contract_name}`) &&
                item.affectedRootKeysList.includes(`${config_1.config.amm_contract}.prices:${contract_name}`));
        });
        const parsed_trades = [];
        trade_transactions.forEach((curr_value, index) => {
            const prev_value = trade_transactions[index - 1];
            let prev_reserves_token;
            if (most_recent_trade_uid === "0" && index === 0) {
                prev_reserves_token = 0;
            }
            else if (most_recent_trade_uid !== "0" && index === 0) {
                prev_reserves_token = most_recent_trade.reserves;
            }
            else {
                prev_reserves_token = (0, misc_utils_1.getNumberFromFixed)(prev_value.state_changes_obj[`${config_1.config.amm_contract}`].reserves[`${contract_name}`][1]);
            }
            const curr_reserves_token = (0, misc_utils_1.getNumberFromFixed)(curr_value.state_changes_obj[`${config_1.config.amm_contract}`].reserves[`${contract_name}`][1]);
            const action = prev_reserves_token < curr_reserves_token ? "sell" : "buy";
            let base_volume = action === "buy" ? curr_reserves_token - prev_reserves_token : prev_reserves_token - curr_reserves_token;
            base_volume = base_volume > 0 ? base_volume : base_volume * -1;
            const tx_uid = curr_value.tx_uid;
            const timestamp = curr_value.timestamp / 1000;
            const base_price = (0, misc_utils_1.getNumberFromFixed)(curr_value.state_changes_obj[`${config_1.config.amm_contract}`].prices[`${contract_name}`]);
            const vk = (0, misc_utils_1.getVkFromKeys)(curr_value.affectedRootKeysList);
            const hash = curr_value.txInfo.hash;
            const trade = {
                tx_uid,
                type: action,
                price: base_price,
                amount: base_volume,
                time: timestamp,
                reserves: curr_reserves_token,
                token_symbol,
                contract_name,
                vk,
                hash
            };
            parsed_trades.push(trade);
        });
        return parsed_trades;
    }
    catch (err) {
        logger_1.log.log(err);
    }
};
exports.parseTrades = parseTrades;
const findMostRecentTradeFromDb = async (contract_name) => {
    const most_recent_trade = await TradeHistoryEntity.findOne({
        where: {
            contract_name
        },
        order: {
            time: "DESC"
        }
    });
    return most_recent_trade;
};
exports.findMostRecentTradeFromDb = findMostRecentTradeFromDb;
const findLastMostRecentTradeFromDb = async (contract_name) => {
    const trades = await TradeHistoryEntity.find({
        where: { contract_name },
        order: {
            time: "DESC"
        },
        take: 2
    });
    const last_most_recent_trade = trades[0];
    return last_most_recent_trade;
};
exports.findLastMostRecentTradeFromDb = findLastMostRecentTradeFromDb;
const saveTradesToDb = async (trades) => {
    const trade_entities = trades.map((trade) => {
        const trade_entity = new TradeHistoryEntity();
        for (let field in trade) {
            trade_entity[field] = trade[field];
        }
        return trade_entity;
    });
    await TradeHistoryEntity.insert(trade_entities);
};
exports.saveTradesToDb = saveTradesToDb;
//# sourceMappingURL=trade-history.entity.js.map