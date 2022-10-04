"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countPairsWithHistoricalTrade = exports.getReservesFromKvp = exports.getVkFromKeys = exports.getNumberFromFixed = exports.writeToFile = exports.arrFromStr = exports.dateNowUtc = exports.getContractCode = exports.getContractEntry = exports.getContractName = exports.getNumber = exports.getValue = exports.getVal = exports.getKey = exports.validateStakingContract = exports.validateTokenContract = exports.getNewJoiner = exports.isLamdenKey = void 0;
const trade_history_entity_1 = require("../entities/core/trade-history.entity");
const pair_entity_1 = require("../entities/core/pair.entity");
const Fs = require("fs");
const validators = require("types-validate-assert");
const { validateTypes } = validators;
const isLamdenKey = (key) => {
    if (validateTypes.isStringHex(key) && key.length === 64)
        return true;
    return false;
};
exports.isLamdenKey = isLamdenKey;
const getNewJoiner = (state, prev_state) => {
    const { players } = state;
    const prev_players = prev_state.players;
    const new_joiner = players.reduce((accum, val) => {
        if (val.indexOf(prev_players) < 0)
            accum = val;
    }, "");
    return new_joiner;
};
exports.getNewJoiner = getNewJoiner;
function validateTokenContract(contract) {
    const required_fields = ["def transfer", "def approve", "def transfer_from"];
    let missing = required_fields.map((field) => contract.includes(field));
    let missing_idx = missing.findIndex((field) => field === false);
    return missing_idx > -1 ? false : true;
}
exports.validateTokenContract = validateTokenContract;
function validateStakingContract(contract) {
    const required_fields = ["def addStakingTokens", "def withdrawTokensAndYield"];
    let missing = required_fields.map((field) => contract.includes(field));
    let missing_idx = missing.findIndex((field) => field === false);
    return missing_idx > -1 ? false : true;
}
exports.validateStakingContract = validateStakingContract;
function getKey(state, idx_1, idx_2) {
    return state[idx_1].key.split(":")[idx_2];
}
exports.getKey = getKey;
function getVal(state, idx) {
    var _a;
    let val;
    if (idx) {
        val = (_a = state[idx]) === null || _a === void 0 ? void 0 : _a.value;
    }
    else {
        val = state === null || state === void 0 ? void 0 : state.value;
    }
    val = (val === null || val === void 0 ? void 0 : val.__fixed__) || val;
    if (typeof val === "number") {
        return val.toString();
    }
    else {
        return val;
    }
}
exports.getVal = getVal;
function getValue(value) {
    if (!value) {
        return 0;
    }
    else if (Number(value) === NaN) {
        return value;
    }
    else if (value.__fixed__) {
        return value.__fixed__;
    }
    else if (value.__hash_self__ || String(value.__hash_self__) === "0") {
        return value.__hash_self__.__fixed__ ? value.__hash_self__.__fixed__ : value.__hash_self__;
    }
    else if (Object.keys(value).length) {
        return 0;
    }
    else {
        return value;
    }
}
exports.getValue = getValue;
function getNumber(value) {
    let return_val = value.__fixed__ ? Number(value.__fixed__) : Number(value);
    return return_val;
}
exports.getNumber = getNumber;
function getContractName(state) {
    let code_entry = getContractEntry(state);
    if (code_entry) {
        let code_key = code_entry.key;
        let contract_name = code_key.split(".")[0];
        return contract_name;
    }
    return "";
}
exports.getContractName = getContractName;
function getContractEntry(state) {
    let code_entry = state.filter((kvp) => {
        return kvp.key.includes("__code__");
    })[0];
    return code_entry;
}
exports.getContractEntry = getContractEntry;
function getContractCode(state) {
    let entry = getContractEntry(state);
    return entry ? entry.value : "";
}
exports.getContractCode = getContractCode;
function dateNowUtc() {
    const minute_difference = new Date().getTimezoneOffset();
    if (minute_difference !== 0) {
        let difference_ms = minute_difference * 60 * 1000;
        return Date.now() + difference_ms;
    }
    return Date.now();
}
exports.dateNowUtc = dateNowUtc;
const arrFromStr = (str, delimiter = ",") => str.split(delimiter);
exports.arrFromStr = arrFromStr;
function writeToFile(data, path) {
    const json = JSON.stringify(data, null, 2);
    Fs.writeFile(path, json, (err) => {
        if (err) {
            console.error(err);
            throw err;
        }
        console.log("Saved data to file.");
    });
}
exports.writeToFile = writeToFile;
const getNumberFromFixed = (value) => (value.__fixed__ ? Number(value.__fixed__) : Number(value));
exports.getNumberFromFixed = getNumberFromFixed;
const getVkFromKeys = (keys) => {
    const k = keys.find((k) => {
        let vk = k.split(":")[1];
        return vk.length === 64;
    });
    return k.split(":")[1];
};
exports.getVkFromKeys = getVkFromKeys;
const getReservesFromKvp = (reserves_kvp, format = "number") => {
    return format === "number" ? [Number(getValue(reserves_kvp.value[0])), Number(getValue(reserves_kvp.value[1]))] : [getValue(reserves_kvp.value[0]), getValue(reserves_kvp.value[1])];
};
exports.getReservesFromKvp = getReservesFromKvp;
const countPairsWithHistoricalTrade = async () => {
    const contracts = (await pair_entity_1.PairEntity.find()).map(p => p.contract_name);
    let results = 0;
    for (let c of contracts) {
        const trades = await trade_history_entity_1.TradeHistoryEntity.find({ where: { contract_name: c }, take: 2 });
        const amount = trades.length;
        if (amount > 1)
            results++;
    }
    return results;
};
exports.countPairsWithHistoricalTrade = countPairsWithHistoricalTrade;
//# sourceMappingURL=misc-utils.js.map