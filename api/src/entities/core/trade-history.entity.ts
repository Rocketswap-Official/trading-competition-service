import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, PrimaryColumnCannotBeNullableError } from "typeorm";
import { config } from "../../config";
import { log } from "../../utils/logger";
import { getNumberFromFixed, getVkFromKeys } from "../../utils/misc-utils";

/** An instance of this entity is created after each time the buy / sell function is successfully called */

@Entity()
export class TradeHistoryEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	contract_name: string;

	@Column()
	price: number;

	@Column()
	time: number;

	@Column()
	amount: string;

	@Column({ nullable: true })
	vk: string;

	@Column()
	type: "buy" | "sell"; // buying or selling the token

	@Column({ nullable: true })
	hash?: string;

	@Column({ nullable: true })
	tx_uid?: string;

	@Column({ nullable: true })
	reserves?: number;

	@Column({ nullable: true })
	is_trade?: boolean;
}

export interface ITrade {
	tx_uid: string;
	type: "buy" | "sell";
	time: number;
	amount: number;
	price: number;
	reserves: number;
	token_symbol: string;
	contract_name: string;
	vk: string;
	hash: string;
	is_trade: boolean
}

export async function saveTradeUpdate(args: {
	contract_name: string;
	price: string;
	amount: string;
	type: "buy" | "sell";
	time: number;
	hash: string
	vk: string
}) {
	const entity = new TradeHistoryEntity();
	for (let arg in args) {
		entity[arg] = args[arg];
	}
	log.log({ args })
	log.log("got to here")
	entity.time = args.time;
	await entity.save();
}

export const parseTrades = async (history: any[], contract_name: string, token_symbol: string) => {
	try {
		let most_recent_trade = await findMostRecentReservesChangeFromDb(contract_name);
		const most_recent_trade_uid = most_recent_trade ? most_recent_trade.tx_uid : "0";

		let last_most_recent_trade;

		if (most_recent_trade) {
			last_most_recent_trade = await findLastMostRecentTradeFromDb(contract_name);
		}
		log.log({ history_length: history.length })
		const reserves_transactions = history.filter((item) => {
			return (
				item.affectedRootKeysList.includes(`${config.amm_contract}.reserves:${contract_name}`)
			);
		});

		const parsed_trades: ITrade[] = [];

		reserves_transactions.forEach((curr_value, index) => {
			const is_trade = curr_value.affectedRootKeysList.includes(`${config.amm_contract}.prices:${contract_name}`)
			const prev_value = reserves_transactions[index - 1];

			let prev_reserves_token;

			if (most_recent_trade_uid === "0" && index === 0) {
				prev_reserves_token = 0;
			} else if (most_recent_trade_uid !== "0" && index === 0) {
				prev_reserves_token = most_recent_trade.reserves;
			} else {
				prev_reserves_token = getNumberFromFixed(
					prev_value.state_changes_obj[`${config.amm_contract}`].reserves[`${contract_name}`][1]
				);
			}
			const curr_reserves_token = getNumberFromFixed(
				curr_value.state_changes_obj[`${config.amm_contract}`].reserves[`${contract_name}`][1]
			);
			const action = prev_reserves_token < curr_reserves_token ? "sell" : "buy";
			let base_volume = action === "buy" ? curr_reserves_token - prev_reserves_token : prev_reserves_token - curr_reserves_token;
			base_volume = base_volume > 0 ? base_volume : base_volume * -1;
			const tx_uid = curr_value.tx_uid;
			const timestamp = curr_value.timestamp / 1000;
			const base_price = is_trade ? getNumberFromFixed(curr_value.state_changes_obj[`${config.amm_contract}`].prices[`${contract_name}`]) : 0
			const vk = getVkFromKeys(curr_value.affectedRootKeysList);
			const hash = curr_value.txInfo.hash;

			const trade: ITrade = {
				tx_uid,
				type: action,
				price: base_price,
				amount: base_volume,
				time: timestamp,
				reserves: curr_reserves_token,
				token_symbol,
				contract_name,
				vk,
				hash,
				is_trade
			};
			parsed_trades.push(trade);
		});

		return parsed_trades;
	} catch (err) {
		log.log(err);
	}
};

export const findMostRecentReservesChangeFromDb = async (contract_name: string) => {
	const most_recent_reserves_change = await TradeHistoryEntity.findOne({
		where: {
			contract_name
		},
		order: {
			time: "DESC"
		}
	});
	return most_recent_reserves_change;
};

export const findLastMostRecentTradeFromDb = async (contract_name: string): Promise<TradeHistoryEntity> => {
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

export const saveTradesToDb = async (trades: ITrade[]) => {
	const trade_entities = trades.map((trade) => {
		const trade_entity = new TradeHistoryEntity();
		for (let field in trade) {
			trade_entity[field] = trade[field];
		}
		return trade_entity;
	});
	await TradeHistoryEntity.insert(trade_entities)
};
