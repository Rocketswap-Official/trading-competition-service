import { BaseEntity } from "typeorm";
import { I_UserCompetitionResult } from "../types";
export declare class UserResultEntity extends BaseEntity implements I_UserCompetitionResult {
    id: string;
    competition_id: string;
    user_vk: string;
    rocket_id?: string;
    volume_tau: number;
    volume_token?: number;
    volume_usd?: number;
}
export declare function findAllUserResults(): unknown;
