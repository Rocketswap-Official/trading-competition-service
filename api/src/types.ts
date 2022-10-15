import { PairEntity } from "./entities/core/pair.entity";

export type T_TradeType = "buy" | "sell"

export type T_Resolution = "1h" | "3h" | "4h" | "6h"

export interface I_Kvp {
    key: string;
    value: any;
}

export interface I_LpPointsState {
    [key: string]: {
        [key: string]: string | { __fixed__: string };
    };
}

export interface I_ReservesState {
    [key: string]: [{ __fixed__: string }, { __fixed__: string }];
}

export interface I_Comp {
    id: string,
    comp_contract: string
    reward_contract: string
    prizes: number[]
    date_start: Date // unix
    date_end: Date // unix
}

export interface I_CompResults {
    competition_id: string
    results: I_UserCompetitionResult[]
}

// export interface I_CompJson {
//     comp_contract: string,
//     reward_contract: string,
//     prizes: number[],
//     date_start: T_CompDate,
//     date_end: T_CompDate
//     comp_contract_title: string
//     reward_contract_title: string
// }

export interface I_UserCompetitionResult {
    id: string
    competition_id: string
    user_vk: string
    rocket_id?: string
    volume_tau: number
    volume_token?: number
    volume_usd?: number
    missed_chunks?: number
    chunk_penalty?: number
}

export type T_CompDate = { year: number, month: number, day: number, hour: number }

/**
 * New competition type.
 * 1. Set a "time window" / "chunk"
 * 2. Each competition is divided into these windows / chunks
 * 3. a variable will be set which will determine how many windows the user must have trades in to avoid being penalised.
 * 4. for each chunk the contestant misses over the threshold varible, they will be deducted a % from their total volume
 */

export type T_CompType = "windowed" | "basic"


export interface I_WindowedComp extends I_TradingComp {
    chunk_window: T_Resolution
    missed_window_threshold_pct: number // what pct of windows a trader can miss before a penalty is applied to their volume
    missed_window_penalty_pct: number
    type: "windowed"
}

export interface I_TradingComp {
    comp_contract: string,
    comp_contract_title: string,
    reward_contract: string,
    reward_contract_title: string,
    prizes: number[],
    date_start: T_CompDate,
    date_end: T_CompDate,
    type?: T_CompType,
    chunk_window?: T_Resolution
    missed_window_threshold_pct?: number // 70% what pct of windows a trader can miss before a penalty is applied to their volume
    missed_window_penalty_pct?: number // 5%
}

// window 4h
// competition 7 days
// 6 windows per day * 7 days
// user window pct = ( 10 / 42 ) * 100
// amount_of_windows_in_timeframe = 42
// if user window pct < missed_window_threshold_pct, apply penalty
// missed_windows_threshold = 0.7 * amount_of_windows_in_timeframe (29)

// penalty = missed_windows_over_threshold 

// @Entity()
// export class CompetitionEntity extends BaseEntity {
// 	@PrimaryColumn()
// 	id: string;

// 	@Column()
// 	competition_contract: string

// 	@Column()
// 	reward_contract: string

// 	@Column({ type: "simple-array" })
// 	prizes: number[]

// 	@Column()
// 	date_start: number

// 	@Column()
// 	date_end: number
// }