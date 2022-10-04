import { I_Kvp } from "../types";
import { BlockDTO } from "./socket-client.provider";
export declare class DataSyncProvider {
    private static token_contract_list;
    static get token_list(): {};
    static updateTokenList: () => Promise<void>;
    onModuleInit(): any;
    parseBlock: (block: BlockDTO) => any;
    processAmmBlock: (args: {
        state: I_Kvp[];
        hash: string;
        timestamp: number;
        user_vk: string;
    }) => any;
}
