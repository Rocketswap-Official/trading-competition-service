import { log } from "./logger";
import { I_Kvp, T_Resolution } from "../types";
import { TradeHistoryEntity } from "../entities/core/trade-history.entity";
import { PairEntity } from "../entities/core/pair.entity";

const Fs = require("fs");

const validators = require("types-validate-assert");
const { validateTypes } = validators;

export const isLamdenKey = (key) => {
	if (validateTypes.isStringHex(key) && key.length === 64) return true;
	return false;
};

export const getNewJoiner = (state, prev_state): string => {
	const { players } = state;
	const prev_players = prev_state.players;

	const new_joiner = players.reduce((accum, val) => {
		if (val.indexOf(prev_players) < 0) accum = val;
	}, "");
	return new_joiner;
};

/**
 * Contracts must have the following fields to be added to the watch list:
 * 'def transfer', 'def balance_of', 'def allowance' 'def approve', 'def transfer_from', 'token_name = Variable', 'token_symbol = Variable'
 */

export function validateTokenContract(contract: string): boolean {
	const required_fields = ["def transfer", "def approve", "def transfer_from"];
	let missing = required_fields.map((field) => contract.includes(field));
	let missing_idx = missing.findIndex((field) => field === false);
	return missing_idx > -1 ? false : true;
}


export function validateStakingContract(contract: string): boolean {
	const required_fields = ["def addStakingTokens", "def withdrawTokensAndYield"];
	let missing = required_fields.map((field) => contract.includes(field));
	let missing_idx = missing.findIndex((field) => field === false);
	return missing_idx > -1 ? false : true;
}


export function getKey(state: I_Kvp[], idx_1: number, idx_2: number) {
	return state[idx_1].key.split(":")[idx_2];
}

/** Returns and parses a value */

export function getVal(state: I_Kvp[] | I_Kvp, idx?: number) {
	let val;
	if (idx) {
		val = state[idx]?.value;
	} else {
		val = (state as I_Kvp)?.value;
	}
	val = val?.__fixed__ || val;
	if (typeof val === "number") {
		return val.toString();
	} else {
		return val;
	}
}

export function getValue(value: any) {
	if (!value) {
		return 0;
	} else if (Number(value)! === NaN) {
		// is
		return value;
	} else if (value.__fixed__) {
		return value.__fixed__;
	} else if (value.__hash_self__ || String(value.__hash_self__) === "0") {
		return value.__hash_self__.__fixed__ ? value.__hash_self__.__fixed__ : value.__hash_self__;
	} else if (Object.keys(value).length) {
		return 0;
	} else {
		return value;
	}
}

export function getNumber(value: any) {
	let return_val = value.__fixed__ ? Number(value.__fixed__) : Number(value);
	return return_val;
}

export function getContractName(state: I_Kvp[]) {
	let code_entry = getContractEntry(state);
	if (code_entry) {
		let code_key = code_entry.key;
		let contract_name = code_key.split(".")[0];
		return contract_name;
	}
	return "";
}

export function getContractEntry(state: I_Kvp[]) {
	let code_entry = state.filter((kvp) => {
		return kvp.key.includes("__code__");
	})[0];
	return code_entry;
}

export function getContractCode(state: I_Kvp[]) {
	let entry = getContractEntry(state);
	return entry ? entry.value : "";
}

export function dateNowUtc() {
	const minute_difference = new Date().getTimezoneOffset();
	if (minute_difference !== 0) {
		let difference_ms = minute_difference * 60 * 1000;
		return Date.now() + difference_ms;
	}
	return Date.now();
}

export const arrFromStr = (str: string, delimiter: string = ","): string[] => str.split(delimiter);

export function writeToFile(data, path) {
	const json = JSON.stringify(data, null, 2);

	Fs.writeFile(path, json, (err) => {
		if (err) {
			console.error(err);
			throw err;
		}

		console.log("Saved data to file.");
	});
}

export const getNumberFromFixed = (value: any) => (value.__fixed__ ? Number(value.__fixed__) : Number(value));

export const getVkFromKeys = (keys: string[]): string => {
	const k = keys.find((k) => {
		let vk = k.split(":")[1];
		return vk.length === 64;
	});
	return k.split(":")[1];
};

interface IRswpBalances {
	vk: string;
	rswp_balance: number;
}

export const getReservesFromKvp = (reserves_kvp: I_Kvp, format: "string" | "number" = "number") => {
	return format === "number" ? [Number(getValue(reserves_kvp.value[0])), Number(getValue(reserves_kvp.value[1]))] : [getValue(reserves_kvp.value[0]), getValue(reserves_kvp.value[1])]
}

export const countPairsWithHistoricalTrade = async () => {
	const contracts = (await PairEntity.find()).map(p => p.contract_name)
	let results = 0

	for (let c of contracts) {
		const trades = await TradeHistoryEntity.find({ where: { contract_name: c }, take: 2 })
		// log.log(trades)
		const amount = trades.length
		if (amount > 1) results++
	}

	return results
}

export const calcSecondsInResolution = (resolution: T_Resolution): number => {
	const suffix = resolution[resolution.length - 1]
	const prefix = Number(resolution.substring(0, resolution.length - 1))
	return prefix * seconds_map[suffix]
}

export const seconds_map = {
	m: 60,
	h: 3600,
	d: 86400,
	w: 604800
}

export function calcMissedWindows(trades: TradeHistoryEntity[], start_unix: number, seconds_resolution: number, number_of_windows: number) {
	let missed = 0
	for (let i = 0; i < number_of_windows; i++) {
		let start = (start_unix / 1000) + (i * seconds_resolution)
		let end = (start_unix / 1000) + (i * seconds_resolution) + seconds_resolution
		let trade = trades.find(t => t.time >= start && t.time < end)
		if (!trade) missed++
	}
	return missed
}
