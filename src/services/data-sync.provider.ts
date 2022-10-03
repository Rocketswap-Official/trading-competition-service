import { Injectable } from "@nestjs/common";
import { getConfig, config } from "../config";
import { getLastProcessedBlock, startTrimLastBlocksTask } from "../entities/core/last-block.entity";
import { getTokenList, PairEntity, savePair, updatePairReserves } from "../entities/core/pair.entity";
import { saveTradeUpdate } from "../entities/core/trade-history.entity";
import { I_Kvp } from "../types";
import { syncTradeHistory, fillBlocksSinceSync, syncAmmCurrentState } from "../utils/blockservice-utils";
import { log } from "../utils/logger";
import { getVal, getValue } from "../utils/misc-utils";
import { initSocket, BlockDTO } from "./socket-client.provider";

@Injectable()
export class DataSyncProvider {
	private static token_contract_list: string[] = []

	public static get token_list() {
		return DataSyncProvider.token_contract_list
	}

	public static updateTokenList = async (): Promise<void> => {
		const token_list_update = await getTokenList();
		DataSyncProvider.token_contract_list = token_list_update;
	};

	async onModuleInit() {
		const last_block_saved_db = await getLastProcessedBlock();

		await syncAmmCurrentState();

		if (!last_block_saved_db) {
			await syncTradeHistory(config.starting_tx_id)
		} else {
			log.log(`last block ${last_block_saved_db} detected in local db.`);
			await fillBlocksSinceSync(last_block_saved_db, this.parseBlock);
		}

		await DataSyncProvider.updateTokenList()
		initSocket(this.parseBlock);
		startTrimLastBlocksTask();

	}


	/**
	 * ALL NEW BLOCKS ARE PASSED THROUGH THIS FUNCTION FOR PROCESSING
	 */

	public parseBlock = async (block: BlockDTO) => {
		const { state, fn, timestamp, hash } = block;
		try {
			/**
			 * Transactions we're interested in :
			 * 1. New pairs being added
			 * 2. Trades
			 * 3. Changes to the reserves of a pair
			 */
			const amm_state_changes = state.filter((s) => s.key.split(".")[0] === getConfig().amm_contract)
			if (!amm_state_changes.length) return

			await this.processAmmBlock({
				state: amm_state_changes
			});
		} catch (err) {
			log.log({ err })
		}
	};

	processAmmBlock = async (args: { state: I_Kvp[] }) => {
		const { state } = args;
		try {
			/**
			 * TO-DO :
			 * if a new pair is created, we must create a genesis candle for it as well.
			 */
			await savePair({
				state,
			});
			await DataSyncProvider.updateTokenList()
			await saveTrade(state)
			await updatePairReserves(state)
		} catch (err) {
			log.log({ err })
		}
	}
}

const saveTrade = async (state: I_Kvp[]) => {
	const traded_tokens = state.filter(s => s.key.includes("prices"))
	if (!traded_tokens.length) return
	for (let token of traded_tokens) {
		const contract_name = token.key.split(":")[1]
		const price = getVal(traded_tokens.find(s => s.key.includes(contract_name)))
		const reserves = state.find(s => s.key.includes('reserves') && s.key.includes(contract_name)).value
		await processTrade(contract_name, reserves, price)
	}
}

const processTrade = async (contract_name: string, reserves: any[], price: string) => {
	const pair = await PairEntity.findOne(contract_name)
	const pair_reserves_old = [Number(pair.reserves[0]), Number(pair.reserves[1])]
	const pair_reserves_new = [Number(getValue(reserves[0])), Number(getValue(reserves[1]))]

	// log.log({ pair_reserves_old, pair_reserves_new })

	// determine if buy or sell
	const type: "buy" | "sell" = pair_reserves_old[0] < pair_reserves_new[0] ? "buy" : "sell"

	// get volume
	const dif = pair_reserves_old[1] - pair_reserves_new[1]
	const volume = dif > 0 ? dif : dif * -1
	// log.log({ volume })
	// save trade
	await saveTradeUpdate({ contract_name, price, amount: String(volume), type, time: Date.now() })
}
