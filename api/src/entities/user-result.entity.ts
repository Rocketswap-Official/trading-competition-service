
import {
	Entity,
	Column,
	PrimaryColumn,
	BaseEntity,
	PrimaryGeneratedColumn,
} from "typeorm";
import { I_UserCompetitionResult } from "../types";


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
}

export async function findAllUserResults() {
	return await UserResultEntity.find()
}