
import {
	Entity,
	Column,
	PrimaryColumn,
	BaseEntity,
} from "typeorm";
import { I_UserCompetitionResult } from "../types";


@Entity()
export class UserResultEntity extends BaseEntity implements I_UserCompetitionResult {
	@PrimaryColumn()
	id: string;

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
}