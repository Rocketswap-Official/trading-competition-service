"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.max_precision = exports.config = exports.getConfig = exports.config_prod = void 0;
exports.config_prod = {
    app_name: "Rocketswap",
    amm_contract: "con_rocketswap_official_v1_1",
    amm_native_token: "con_rswp_lst001",
    network_type: "mainnet",
    block_service_urls: ((_a = process.env.block_service_urls) === null || _a === void 0 ? void 0 : _a.split(",")) || ["165.22.47.195:3535"],
    starting_tx_id: "000001044563.00000.00000",
    frequency: 10000
};
const getConfig = () => exports.config_prod;
exports.getConfig = getConfig;
exports.config = (0, exports.getConfig)();
exports.max_precision = 10;
//# sourceMappingURL=config.js.map