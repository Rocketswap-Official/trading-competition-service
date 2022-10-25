export interface I_Competition {
    id: string;
    comp_contract: string;
    comp_contract_title: string;
    reward_contract: string;
    reward_contract_title: string;
    prizes: number[];
    date_start: Date;
    date_start_unix: number;
    date_end: Date;
    date_end_unix: number;
    type?: T_CompType;
    chunk_window?: T_Resolution;
    missed_window_threshold_pct?: number;
    missed_window_threshold?: number;
    missed_window_penalty_pct?: number;
    total_windows?: number;
    status: "upcoming" | "active" | "finished"
}

export type T_CompType = "windowed" | "basic"
export type T_Resolution = "1h" | "3h" | "4h" | "6h"