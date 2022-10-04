import { PairEntity } from "./entities/core/pair.entity";

export type T_TradeType = "buy" | "sell"

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

export interface I_CompJson {
    comp_contract: string,
    reward_contract: string,
    prizes: number[],
    date_start: T_CompDate,
    date_end: T_CompDate
    comp_contract_title: string
    reward_contract_title: string
}

export interface I_UserCompetitionResult {
    id: string
    competition_id: string
    user_vk: string
    rocket_id?: string
    volume_tau: number
    volume_token?: number
    volume_usd?: number
}

export type T_CompDate = { year: number, month: number, day: number, hour: number }

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