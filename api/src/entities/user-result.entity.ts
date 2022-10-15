
import {
	Entity,
	Column,
	PrimaryColumn,
	BaseEntity,
	PrimaryGeneratedColumn,
} from "typeorm";
import { I_UserCompetitionResult, T_CompType } from "../types";


@Entity()
export class UserResultEntity extends BaseEntity implements I_UserCompetitionResult {
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	competition_id: string;

	@Column()
	user_vk: string

	@Column({ nullable: true })
	rocket_id?: string

	@Column()
	volume_tau: number

	@Column({ nullable: true })
	volume_token?: number

	@Column({ nullable: true })
	volume_usd?: number

	@Column({ nullable: true })
	missed_windows?: number

	@Column({ nullable: true })
	missed_window_pct?: number

	@Column({ nullable: true })
	missed_window_above_threshold?: number

	@Column({ nullable: true })
	volume_tau_penalty?: number // how much volume to deduct from a user's gross volume

	@Column({ nullable: true })
	volume_tau_net?: number

	@Column()
	competition_type: T_CompType
}

export async function findAllUserResults() {
	return await UserResultEntity.find({ order: { volume_tau: "DESC" } })
}