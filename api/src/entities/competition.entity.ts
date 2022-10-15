
import {
	Entity,
	Column,
	PrimaryColumn,
	BaseEntity,
	MoreThan,
	LessThan
} from "typeorm";
import { I_Comp, I_Kvp, T_CompDate, T_CompType, T_Resolution, I_TradingComp } from "../types";
import { calcSecondsInResolution } from "../utils/misc-utils";
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

	@Column({ nullable: true })
	type?: T_CompType

	@Column({ nullable: true })
	chunk_window?: T_Resolution

	@Column({ nullable: true })
	missed_window_threshold_pct?: number

	@Column({ nullable: true })
	missed_window_threshold?: number

	@Column({ nullable: true })
	missed_window_penalty_pct?: number

	@Column({ nullable: true })
	total_windows?: number
}

export async function createCompetitions(comp_json: I_TradingComp[]) {
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
			entity.type = comp.type = comp.type || "basic"
			entity.chunk_window = comp.chunk_window || null
			entity.missed_window_penalty_pct = comp.missed_window_penalty_pct || null
			entity.missed_window_threshold_pct = comp.missed_window_threshold_pct || null
			entity.total_windows = entity.chunk_window ? Math.round((entity.date_end_unix - entity.date_start_unix) / calcSecondsInResolution(comp.chunk_window) / 1000) : null
			entity.missed_window_threshold = entity.chunk_window ?
				Math.round((entity.date_end_unix - entity.date_start_unix) / calcSecondsInResolution(comp.chunk_window) / 1000) * (entity.missed_window_threshold_pct / 100) :
				null
			entities_to_save.push(entity)
		}
	}
	await CompetitionEntity.insert(entities_to_save)
}

function constructCompetitionId(comp_data: I_TradingComp) {
	const str = `${comp_data.comp_contract}${constructDate(comp_data.date_start).getTime()}`
	// return crypto.createHash('md5').update(str).digest('hex');
	return str
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
	const { hours_offset } = calcUtcOffset()
	return new Date(year, month, day, hour + hours_offset)
}

function calcUtcOffset() {
	const now = new Date(Date.now())
	const now_hours = now.getHours()
	const utc_hours = now.getUTCHours()
	const now_minutes = now.getMinutes()
	const utc_minutes = now.getUTCMinutes()
	return { hours_offset: now_hours - utc_hours, minutes_offset: now_minutes - utc_minutes }
}