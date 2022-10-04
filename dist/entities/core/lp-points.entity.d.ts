import { BaseEntity } from "typeorm";
import { I_Kvp } from "../../types";
export declare class LpPointsEntity extends BaseEntity {
    vk: string;
    points: {
        [key: string]: string;
    };
    time: string;
}
export declare function saveUserLp(args: {
    state: I_Kvp[];
}): any;
