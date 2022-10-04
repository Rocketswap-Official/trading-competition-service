"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncLpPointsEntities = exports.syncPairEntities = exports.syncAmmCurrentState = exports.syncTokenTradeHistory = exports.getTxIdFromHash = exports.syncTradeHistoryFromLatestTradeInDb = exports.syncTradeHistory = exports.fillBlocksSinceSync = exports.getBlock = exports.getLatestSyncedBlock = exports.examineTxState = exports.getContractMeta = exports.getContractSource = exports.getAllContracts = exports.getNumberFromFixed = exports.getCurrentSyncedBlock = exports.getRootKeyChanges = exports.getContractState = exports.getContractChanges = exports.getCurrentKeyValue = exports.getVariableChanges = void 0;
const config_1 = require("../config");
const lp_points_entity_1 = require("../entities/core/lp-points.entity");
const pair_entity_1 = require("../entities/core/pair.entity");
const trade_history_entity_1 = require("../entities/core/trade-history.entity");
const block_service_1 = require("../services/block.service");
const socket_client_provider_1 = require("../services/socket-client.provider");
const logger_1 = require("./logger");
const misc_utils_1 = require("./misc-utils");
const axiosDefaultConfig = {
    proxy: false
};
const axios = require("axios").create(axiosDefaultConfig);
const getVariableChanges = async (contractName, variableName, last_tx_uid, limit = 10) => {
    let endpoint = "variable_history";
    let query = [`contract=${contractName}`, `variable=${variableName}`, `last_tx_uid=${last_tx_uid}`, `limit=${limit}`].join("&");
    let res = await axios.get(`http://${block_service_1.BlockService.get_block_service_url()}/${endpoint}?${query}`);
    return res.data;
};
exports.getVariableChanges = getVariableChanges;
const getCurrentKeyValue = async (contractName, variableName, key) => {
    try {
        let endpoint = "current/one";
        let res = await axios(`http://${block_service_1.BlockService.get_block_service_url()}/${endpoint}/${contractName}/${variableName}/${key}`);
        return res.data;
    }
    catch (e) {
        return e;
    }
};
exports.getCurrentKeyValue = getCurrentKeyValue;
const getContractChanges = async (contractName, last_tx_uid, limit = 10) => {
    let endpoint = "contract_history";
    let query = [`contract=${contractName}`, `last_tx_uid=${last_tx_uid}`, `limit=${limit}`].join("&");
    let res = await axios(`http://${block_service_1.BlockService.get_block_service_url()}/${endpoint}?${query}`);
    return res.data;
};
exports.getContractChanges = getContractChanges;
const getContractState = async (contractName) => {
    try {
        let endpoint = "current/all";
        const url = `http://${block_service_1.BlockService.get_block_service_url()}/${endpoint}/${contractName}`;
        let res = await axios(url);
        return res.data;
    }
    catch (err) {
        logger_1.log.warn(err);
    }
};
exports.getContractState = getContractState;
const getRootKeyChanges = async (args) => {
    try {
        const { contractName, variableName, root_key, last_tx_uid, limit } = args;
        let endpoint = "rootkey_history";
        let query = [
            `contract=${contractName}`,
            `variable=${variableName}`,
            `root_key=${root_key}`,
            `last_tx_uid=${last_tx_uid}`,
            `limit=${limit}`
        ].join("&");
        let res = await axios.get(`http://${block_service_1.BlockService.get_block_service_url()}/${endpoint}?${query}`);
        return res.data;
    }
    catch (err) {
        logger_1.log.warn(err);
    }
};
exports.getRootKeyChanges = getRootKeyChanges;
async function getCurrentSyncedBlock() {
    const res = await axios.get(`http://${block_service_1.BlockService.get_block_service_url()}/latest_synced_block`);
    return res.latest_synced_block;
}
exports.getCurrentSyncedBlock = getCurrentSyncedBlock;
const getNumberFromFixed = (value) => (value.__fixed__ ? Number(value.__fixed__) : Number(value));
exports.getNumberFromFixed = getNumberFromFixed;
const getAllContracts = async () => {
    const res = await axios.get(`http://${block_service_1.BlockService.get_block_service_url()}/contracts`);
    return res.data;
};
exports.getAllContracts = getAllContracts;
const getContractSource = async (contract_name) => {
    const endpoint = "current/one";
    const res = await axios.get(`http://${block_service_1.BlockService.get_block_service_url()}/${endpoint}/${contract_name}/__code__`);
    return res.data;
};
exports.getContractSource = getContractSource;
const getContractMeta = async (contract_name) => {
    const endpoint = "current/all";
    const res = await axios.get(`http://${block_service_1.BlockService.get_block_service_url()}/${endpoint}/${contract_name}`);
    return res.data;
};
exports.getContractMeta = getContractMeta;
const examineTxState = (history) => {
    const price_affected = history.filter((hist) => { var _a, _b; return (_b = (_a = hist.state_changes_obj) === null || _a === void 0 ? void 0 : _a.con_rocketswap_official_v1_1) === null || _b === void 0 ? void 0 : _b.prices; });
    const methods = {};
    price_affected.forEach((hist) => {
        const tx_type = hist.txInfo.transaction.payload.function;
        if (!methods[tx_type]) {
            methods[tx_type] = 1;
        }
        else
            methods[tx_type]++;
    });
    const last_tx = price_affected[price_affected.length - 1];
    const last_tx_time = new Date(last_tx.txInfo.transaction.metadata.timestamp * 1000);
};
exports.examineTxState = examineTxState;
async function getLatestSyncedBlock() {
    var _a;
    const res = await axios(`http://${block_service_1.BlockService.get_block_service_url()}/latest_synced_block`);
    return (_a = res.data) === null || _a === void 0 ? void 0 : _a.latest_synced_block;
}
exports.getLatestSyncedBlock = getLatestSyncedBlock;
async function getBlock(num) {
    const res = await axios(`http://${block_service_1.BlockService.get_block_service_url()}/blocks/${num}`);
    return res.data;
}
exports.getBlock = getBlock;
async function fillBlocksSinceSync(block_to_sync_from, parseBlock) {
    try {
        let current_block = await getLatestSyncedBlock();
        if (block_to_sync_from === current_block) {
            logger_1.log.log("Finished syncing historical blocks");
            return;
        }
        let next_block_to_sync = block_to_sync_from + 1;
        const block = await getBlock(next_block_to_sync);
        await (0, socket_client_provider_1.handleNewBlock)(block, parseBlock);
        if (next_block_to_sync <= current_block)
            return await fillBlocksSinceSync(next_block_to_sync, parseBlock);
    }
    catch (err) {
        logger_1.log.warn({ err });
    }
}
exports.fillBlocksSinceSync = fillBlocksSinceSync;
async function syncTradeHistory(starting_tx_id = "0") {
    const pairs = await pair_entity_1.PairEntity.find();
    for (let p of pairs) {
        await (0, exports.syncTokenTradeHistory)(starting_tx_id, 3000, p.contract_name, p.token_symbol);
    }
}
exports.syncTradeHistory = syncTradeHistory;
const syncTradeHistoryFromLatestTradeInDb = async () => {
    try {
        const latest_trade = await trade_history_entity_1.TradeHistoryEntity.findOne({ order: { time: "DESC" } });
        let latest_trade_uid = latest_trade.tx_uid;
        if (!latest_trade_uid)
            latest_trade_uid = await (0, exports.getTxIdFromHash)(latest_trade.hash);
        logger_1.log.log(`syncing trade history from tx.uuid : ${latest_trade_uid}`);
        return await syncTradeHistory(latest_trade_uid);
    }
    catch (err) {
        logger_1.log.log(err);
    }
};
exports.syncTradeHistoryFromLatestTradeInDb = syncTradeHistoryFromLatestTradeInDb;
const getTxIdFromHash = async (hash) => {
    try {
        const res = await axios.get(`http://${block_service_1.BlockService.get_block_service_url()}/tx?hash=${hash}`);
        const uid = res.data.tx_uid;
        logger_1.log.log({ fn: "getTxIdFromHash", uid });
        return uid;
    }
    catch (err) {
        logger_1.log.error(err);
        throw err;
    }
};
exports.getTxIdFromHash = getTxIdFromHash;
const syncTokenTradeHistory = async (starting_tx_id = "0", batch_size = 3000, contract_name, token_symbol) => {
    logger_1.log.log(`${contract_name} retrieving more trades from ${starting_tx_id}`);
    const res = await (0, exports.getRootKeyChanges)({
        contractName: contract_name,
        variableName: "balances",
        root_key: config_1.config.amm_contract,
        last_tx_uid: starting_tx_id,
        limit: batch_size
    });
    const history = res.history;
    const length = history.length;
    const trades = await (0, trade_history_entity_1.parseTrades)(history, contract_name, token_symbol);
    await (0, trade_history_entity_1.saveTradesToDb)(trades);
    if (length === batch_size) {
        const tx_uid = history[history.length - 1].tx_uid;
        return await (0, exports.syncTokenTradeHistory)(tx_uid, batch_size, contract_name, token_symbol);
    }
};
exports.syncTokenTradeHistory = syncTokenTradeHistory;
const syncAmmCurrentState = async () => {
    const current_state = await (0, exports.getContractState)(config_1.config.amm_contract);
    const amm_state = current_state[config_1.config.amm_contract];
    if (amm_state) {
        const { lp_points, reserves } = amm_state;
        await (0, exports.syncLpPointsEntities)(lp_points);
        await (0, exports.syncPairEntities)(reserves);
    }
    logger_1.log.log("AMM_META state synced");
};
exports.syncAmmCurrentState = syncAmmCurrentState;
const syncPairEntities = async (reserves_state) => {
    const lp_totals = await lp_points_entity_1.LpPointsEntity.findOne({ where: { vk: "__hash_self__" } });
    for (let contract of Object.keys(reserves_state)) {
        const reserves = reserves_state[contract];
        let ent = await pair_entity_1.PairEntity.findOne(contract);
        if (!ent)
            ent = new pair_entity_1.PairEntity();
        ent.contract_name = contract;
        ent.lp = lp_totals.points[contract];
        ent.reserves = [(0, misc_utils_1.getValue)(reserves[0]), (0, misc_utils_1.getValue)(reserves[1])];
        ent.price = String(Number(ent.reserves[0]) / Number(ent.reserves[1]));
        await ent.save();
    }
};
exports.syncPairEntities = syncPairEntities;
const syncLpPointsEntities = async (lp_points_state) => {
    const contract_keys = Object.keys(lp_points_state);
    for (let contract of contract_keys) {
        const contract_obj = lp_points_state[contract];
        const address_keys = Object.keys(contract_obj);
        for (let vk of address_keys) {
            const lp_value = (0, misc_utils_1.getValue)(contract_obj[vk]);
            let lp_points_entity = await lp_points_entity_1.LpPointsEntity.findOne({ where: { vk } });
            if (!lp_points_entity) {
                lp_points_entity = new lp_points_entity_1.LpPointsEntity();
                lp_points_entity.vk = vk;
                lp_points_entity.points = {};
            }
            lp_points_entity.points[contract] = String(lp_value);
            await lp_points_entity.save();
        }
    }
};
exports.syncLpPointsEntities = syncLpPointsEntities;
//# sourceMappingURL=blockservice-utils.js.map