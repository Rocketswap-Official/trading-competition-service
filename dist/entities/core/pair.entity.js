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
exports.updatePairReserves = exports.getTokenList = exports.savePairLp = exports.savePair = exports.saveReserves = exports.PairEntity = void 0;
const typeorm_1 = require("typeorm");
const misc_utils_1 = require("../../utils/misc-utils");
let PairEntity = class PairEntity extends typeorm_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.time = Date.now().toString();
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], PairEntity.prototype, "contract_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PairEntity.prototype, "lp", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PairEntity.prototype, "time", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PairEntity.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PairEntity.prototype, "token_symbol", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "simple-json" }),
    __metadata("design:type", Array)
], PairEntity.prototype, "reserves", void 0);
PairEntity = __decorate([
    (0, typeorm_1.Entity)()
], PairEntity);
exports.PairEntity = PairEntity;
async function saveReserves(fn, state, timestamp, hash, rswp_token_contract) {
    const reserve_kvps = state.filter((kvp) => kvp.key.includes("reserves"));
    const rswp_reserves = reserve_kvps.find((kvp) => kvp.key.includes(rswp_token_contract));
    const pair_reserves = reserve_kvps.find((kvp) => !kvp.key.includes(rswp_token_contract));
    const prices_kvps = state.filter((kvp) => kvp.key.includes("prices"));
    const rswp_price_kvp = prices_kvps.find((kvp) => kvp.key.includes(rswp_token_contract));
    const pair_price_kvp = prices_kvps.find((kvp) => !kvp.key.includes(rswp_token_contract));
    const lp_kvp = state.find((kvp) => kvp.key.includes("lp_points") && kvp.key.split(":").length === 2);
    if (rswp_reserves && pair_reserves) {
        let rswp_reserves_entity = await PairEntity.findOne({ where: { contract_name: rswp_token_contract } });
        if (!rswp_reserves_entity)
            rswp_reserves_entity = new PairEntity();
        rswp_reserves_entity.contract_name = rswp_token_contract;
        rswp_reserves_entity.reserves = [rswp_reserves.value[0].__fixed__, rswp_reserves.value[1].__fixed__];
        await rswp_reserves_entity.save();
    }
    if (pair_reserves) {
        await updateReserves({
            update_reserves: pair_reserves,
            price_kvp: pair_price_kvp,
            lp_kvp,
            state,
            fn,
            hash,
            timestamp
        });
    }
    if (rswp_reserves && !pair_reserves) {
        await updateReserves({
            update_reserves: rswp_reserves,
            price_kvp: rswp_price_kvp,
            lp_kvp,
            state,
            fn,
            hash,
            timestamp
        });
    }
}
exports.saveReserves = saveReserves;
async function updateReserves(args) {
    var _a;
    const { update_reserves, price_kvp, lp_kvp, state, fn, hash, timestamp } = args;
    let contract_name = update_reserves.key.split(":")[1];
    let vk_kvp = state.find((kvp) => {
        return kvp.key.includes(`${contract_name}.balances`) && (0, misc_utils_1.isLamdenKey)(kvp.key.split(":")[1]);
    });
    let vk = (_a = vk_kvp.key) === null || _a === void 0 ? void 0 : _a.split(":")[1];
    let old_token_reserve;
    let reserves = [update_reserves.value[0].__fixed__, update_reserves.value[1].__fixed__];
    let price = (0, misc_utils_1.getVal)(price_kvp);
    let lp = (0, misc_utils_1.getVal)(lp_kvp);
    let entity = await PairEntity.findOne({ where: { contract_name } });
    if (!entity) {
        entity = new PairEntity();
        entity.contract_name = contract_name;
        entity.reserves = reserves;
    }
    else {
        if (entity.reserves) {
            old_token_reserve = entity.reserves[1];
        }
        if (fn === "buy" || fn === "sell") {
            let amount_exchanged = getAmountExchanged(fn, old_token_reserve, reserves);
            updateTradeFeed({
                contract_name,
                token_symbol: entity.token_symbol,
                type: fn,
                amount: amount_exchanged,
                price,
                time: timestamp,
                hash
            });
        }
    }
    if (price_kvp)
        entity.price = price;
    if (lp_kvp)
        entity.lp = lp;
    if (reserves)
        entity.reserves = reserves;
    entity.time = Date.now().toString();
    await entity.save();
}
const getAmountExchanged = (fn, old_token_reserve, reserves) => {
    return fn === "buy"
        ? (parseFloat(old_token_reserve) - parseFloat(reserves[1])).toString()
        : (parseFloat(reserves[1]) - parseFloat(old_token_reserve)).toString();
};
function updateTradeFeed(args) {
    const { type, amount, contract_name, token_symbol, price, time, hash } = args;
}
async function savePair(args) {
    const { state } = args;
    let new_token = false;
    const pair_kvp = state.find((kvp) => kvp.key.split(".")[1].split(":")[0] === "pairs");
    if (!pair_kvp)
        return;
    const contract_name = pair_kvp.key.split(".")[1].split(":")[1];
    let pair_entity = await PairEntity.findOne(contract_name);
    if (pair_entity)
        return;
    pair_entity = new PairEntity();
    pair_entity.contract_name = contract_name;
    await pair_entity.save();
}
exports.savePair = savePair;
async function savePairLp(state) {
    const lp_kvp = state.find((kvp) => kvp.key.includes("lp_points") && kvp.key.split(":").length === 2);
    if (lp_kvp) {
        const parts = lp_kvp.key.split(".")[1].split(":");
        if (parts.length === 2) {
            const contract_name = parts[1];
            let entity = await PairEntity.findOne({ where: { contract_name } });
            if (!entity)
                entity = new PairEntity();
            entity.contract_name = contract_name;
            entity.lp = (0, misc_utils_1.getVal)(lp_kvp);
            await entity.save();
        }
    }
}
exports.savePairLp = savePairLp;
async function getTokenList() {
    const tokens = await PairEntity.find();
    return tokens.map((token) => token.contract_name);
}
exports.getTokenList = getTokenList;
async function updatePairReserves(state) {
    const reserves_updates = state.filter(s => s.key.includes('reserves'));
    if (!reserves_updates.length)
        return;
    const reserves_to_update = reserves_updates.map(r => {
        return {
            contract_name: r.key.split(":")[1],
            reserves: (0, misc_utils_1.getReservesFromKvp)(r, "string")
        };
    });
    for (let r of reserves_to_update) {
        const pair_entity = await PairEntity.findOne(r.contract_name);
        pair_entity.reserves = r.reserves;
        await pair_entity.save();
    }
}
exports.updatePairReserves = updatePairReserves;
//# sourceMappingURL=pair.entity.js.map