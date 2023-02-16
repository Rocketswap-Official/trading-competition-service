import { log } from "./utils/logger";

interface IApiConfig {
	app_name: string;
	dex_token: string;
	amm_contract: string;
	identity_contract: string;
	buy: number;
	currency_symbol: string;
	masternode: string;
	network_type: string;
	staking_contract_submittor: string;
	block_service_urls: string[];
	lamden_version: "v1" | "v2";
	network_name: string;
	lusd_token: string;
	starting_tx_id: string;
	frequency: number;
    blacklisted_addresses: string[]

}

/**
 * Lamden V2 Testnet
 *
 * Masternodes :
 * https://testnet-v2-master-lon.lamden.io/ping
 * https://testnet-v2-master-sf.lamden.io/ping
 * https://testnet-v2-master-bang.lamden.io/ping
 *
 * Blockservices :
 * https://testnet-v2-bs-bang.lamden.io",
 * https://testnet-v2-bs-sf.lamden.io",
 * https://testnet-v2-bs-lon.lamden.io
 *
 */


export const config_prod: IApiConfig = {
	app_name: "Rocketswap",
	amm_contract: process.env.CONTRACT_NAME || "con_rocketswap_official_v1_1",
	identity_contract: process.env.IDENTITY_CONTRACT || "con_rocket_id_v1",
	dex_token: process.env.DEX_TOKEN || "con_rswp_lst001",
	lusd_token: "con_lusd_lst001",
	buy: 150,
	currency_symbol: process.env.CURRENCY_SYMBOL || "TAU",
	masternode: process.env.MASTERNODE_URL || "https://arko-mn-3.lamden.io",
	network_type: process.env.NETWORK_TYPE || "mainnet",
	network_name: process.env.NETWORK_NAME || "arko",
	staking_contract_submittor: "7c296eb80e379171f694a3c5be7640d16f300f09d731c99ac0a92f49c9c0c151",
	block_service_urls: process.env.block_service_urls?.split(",") || ["arko-bs-2.lamden.io","arko-bs-3.lamden.io","arko-bs-1.lamden.io"],
	lamden_version: "v2",
	starting_tx_id: "0",
    frequency: 10000,
    blacklisted_addresses: ["889f923fb54a79deb11ee2850010488992222c92351d3024ea3a737b78fab0eb"]
};

const getConfig = () => {
	const network_type = process.env.NETWORK_TYPE;
	return network_type === "testnet" ? config_prod : config_prod;
};

export let config = getConfig();
log.log({ config });

export const isTestnet = () => {
	return config.network_type === "testnet" ? true : false;
};
