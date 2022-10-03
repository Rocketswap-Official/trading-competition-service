
import {
	Entity,
	Column,
	PrimaryColumn,
	BaseEntity,
	MoreThan,
	LessThan
} from "typeorm";
import { I_Comp, I_CompJson, I_Kvp } from "../types";


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
	date_start: number // Unix Datetime

	@Column()
	date_end: number // Unix Datetime
}

export async function createCompetitions(comp_data: I_CompJson[]) {
	const entities_to_save = []
	for (let comp of comp_data) {
		const comp_id = constructCompetitionId(comp)
		let entity = await CompetitionEntity.findOne(comp_id)
		if (!entity) {
			entity = new CompetitionEntity()
			entity.id = comp_id
			entity.date_end = comp.date_end
			entity.date_start = comp.date_start
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
	return `${comp_data.comp_contract}-${comp_data.reward_contract}-${comp_data.date_start}-${comp_data.date_end}`
}

export async function findActiveCompetitions() {
	const now = Date.now()
	const active_comps = (await CompetitionEntity.find({ where: { date_end: MoreThan(now) } })).filter((c) => c.date_start < now)
	return active_comps
}