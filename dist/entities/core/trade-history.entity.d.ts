import { BaseEntity } from "typeorm";
export declare class TradeHistoryEntity extends BaseEntity {
    id: string;
    contract_name: string;
    price: number;
    time: number;
    amount: string;
    vk: string;
    type: "buy" | "sell";
    hash?: string;
    tx_uid?: string;
    reserves?: number;
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
}
export declare function saveTradeUpdate(args: {
    contract_name: string;
    price: string;
    amount: string;
    type: "buy" | "sell";
    time: number;
    hash: string;
    vk: string;
}): any;
export declare const parseTrades: (history: any[], contract_name: string, token_symbol: string) => unknown;
export declare const findMostRecentTradeFromDb: (contract_name: string) => unknown;
export declare const findLastMostRecentTradeFromDb: (contract_name: string) => Promise<TradeHistoryEntity>;
export declare const saveTradesToDb: (trades: ITrade[]) => any;
