
import {
	Entity,
	Column,
	PrimaryColumn,
	BaseEntity,
	MoreThan,
	LessThan
} from "typeorm";
import { I_Comp, I_CompJson, I_Kvp, T_CompDate } from "../types";
var crypto = require('crypto');


@Entity()
export class CompetitionEntity extends BaseEntity implements I_Comp {
	@PrimaryColumn()
	id: string;

	@Column()
	comp_contract: string

	@Column()
	comp_contract_title: string

	@Column()
	reward_contract: string

	@Column()
	reward_contract_title: string

	@Column({ type: "simple-array" })
	prizes: number[]

	@Column()
	date_start: Date

	@Column()
	date_start_unix: number // Unix Datetime

	@Column()
	date_end: Date

	@Column()
	date_end_unix: number // Unix Datetime
}

export async function createCompetitions(comp_json: I_CompJson[]) {
	const entities_to_save = []
	for (let comp of comp_json) {
		const comp_id = constructCompetitionId(comp)
		let entity = await CompetitionEntity.findOne(comp_id)
		if (!entity) {
			entity = new CompetitionEntity()
			entity.id = comp_id
			entity.date_end = constructDate(comp.date_end)
			entity.date_end_unix = entity.date_end.getTime()
			entity.date_start = constructDate(comp.date_start)
			entity.date_start_unix = entity.date_start.getTime()
			entity.prizes = comp.prizes
			entity.reward_contract_title = comp.reward_contract_title
			entity.reward_contract = comp.reward_contract
			entity.comp_contract = comp.comp_contract
			entity.comp_contract_title = comp.comp_contract_title
			entities_to_save.push(entity)
		}
	}
	await CompetitionEntity.insert(entities_to_save)
}

function constructCompetitionId(comp_data: I_CompJson) {
	const str = `${comp_data.comp_contract}-${comp_data.reward_contract}-${constructDate(comp_data.date_start).getTime()}-${constructDate(comp_data.date_end).getTime()}`
	return crypto.createHash('md5').update(str).digest('hex');
}

export async function findActiveCompetitions() {
	const now = Date.now()
	const active_comps = (await CompetitionEntity.find({ where: { date_end: MoreThan(now) } })).filter((c) => c.date_start_unix < now)
	return active_comps
}

export async function findAllCompetitions() {
	return await CompetitionEntity.find()
}

function constructDate(date: T_CompDate) {
	const { year, month, day, hour } = date
	return new Date(year, month, day, hour)
}