export const config_prod = {
    app_name: "Rocketswap",
    amm_contract: "con_rocketswap_official_v1_1",
    amm_native_token: "con_rswp_lst001",
    network_type: "mainnet",
    block_service_urls: process.env.block_service_urls?.split(",") || ["0.0.0.0:3535"],
    starting_tx_id: "000001044563.00000.00000",
    frequency: 10000
};

export const getConfig = () => config_prod

export let config = getConfig();

export const max_precision = 10