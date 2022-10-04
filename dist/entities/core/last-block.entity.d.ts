import { BaseEntity } from "typeorm";
export declare class LastBlockEntity extends BaseEntity {
    id: number;
    last_block: number;
}
export declare function updateLastBlock(args: {
    block_num: number;
}): any;
export declare function getLastProcessedBlock(): unknown;
export declare function startTrimLastBlocksTask(): any;
