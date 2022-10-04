"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllCompetitions = exports.findActiveCompetitions = exports.createCompetitions = exports.CompetitionEntity = void 0;
const typeorm_1 = require("typeorm");
var crypto = require('crypto');
let CompetitionEntity = class CompetitionEntity extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], CompetitionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CompetitionEntity.prototype, "comp_contract", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CompetitionEntity.prototype, "comp_contract_title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CompetitionEntity.prototype, "reward_contract", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CompetitionEntity.prototype, "reward_contract_title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "simple-array" }),
    __metadata("design:type", Array)
], CompetitionEntity.prototype, "prizes", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], CompetitionEntity.prototype, "date_start", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CompetitionEntity.prototype, "date_start_unix", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], CompetitionEntity.prototype, "date_end", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CompetitionEntity.prototype, "date_end_unix", void 0);
CompetitionEntity = __decorate([
    (0, typeorm_1.Entity)()
], CompetitionEntity);
exports.CompetitionEntity = CompetitionEntity;
async function createCompetitions(comp_json) {
    const entities_to_save = [];
    for (let comp of comp_json) {
        const comp_id = constructCompetitionId(comp);
        let entity = await CompetitionEntity.findOne(comp_id);
        if (!entity) {
            entity = new CompetitionEntity();
            entity.id = comp_id;
            entity.date_end = constructDate(comp.date_end);
            entity.date_end_unix = entity.date_end.getTime();
            entity.date_start = constructDate(comp.date_start);
            entity.date_start_unix = entity.date_start.getTime();
            entity.prizes = comp.prizes;
            entity.reward_contract_title = comp.reward_contract_title;
            entity.reward_contract = comp.reward_contract;
            entity.comp_contract = comp.comp_contract;
            entity.comp_contract_title = comp.comp_contract_title;
            entities_to_save.push(entity);
        }
    }
    await CompetitionEntity.insert(entities_to_save);
}
exports.createCompetitions = createCompetitions;
function constructCompetitionId(comp_data) {
    const str = `${comp_data.comp_contract}-${comp_data.reward_contract}-${constructDate(comp_data.date_start).getTime()}-${constructDate(comp_data.date_end).getTime()}`;
    return crypto.createHash('md5').update(str).digest('hex');
}
async function findActiveCompetitions() {
    const now = Date.now();
    const active_comps = (await CompetitionEntity.find({ where: { date_end: (0, typeorm_1.MoreThan)(now) } })).filter((c) => c.date_start_unix < now);
    return active_comps;
}
exports.findActiveCompetitions = findActiveCompetitions;
async function findAllCompetitions() {
    return await CompetitionEntity.find();
}
exports.findAllCompetitions = findAllCompetitions;
function constructDate(date) {
    const { year, month, day, hour } = date;
    return new Date(year, month, day, hour);
}
//# sourceMappingURL=competition.entity.js.map