
import {
	Entity,
	Column,
	PrimaryColumn,
	BaseEntity,
} from "typeorm";
import { config } from "../config";
import { I_Competition, I_Kvp } from "../types";
import { getVal } from "../utils/misc-utils";


@Entity()
export class CompetitionEntity extends BaseEntity implements I_Competition {
	@PrimaryColumn()
	id: string;

	@Column()
	competition_contract: string

	@Column()
	reward_contract: string

	@Column({ type: "simple-array" })
	prizes: number[]

	@Column()
	date_start: number

	@Column()
	date_end: number
}