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
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveUserLp = exports.LpPointsEntity = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("../../config");
const misc_utils_1 = require("../../utils/misc-utils");
let LpPointsEntity = class LpPointsEntity extends typeorm_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.time = Date.now().toString();
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], LpPointsEntity.prototype, "vk", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "simple-json" }),
    __metadata("design:type", Object)
], LpPointsEntity.prototype, "points", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LpPointsEntity.prototype, "time", void 0);
LpPointsEntity = __decorate([
    (0, typeorm_1.Entity)()
], LpPointsEntity);
exports.LpPointsEntity = LpPointsEntity;
async function saveUserLp(args) {
    const { state } = args;
    const lp_kvp = state.filter((kvp) => {
        const parts = kvp.key.split(":");
        return parts[0] === `${config_1.config.amm_contract}.lp_points`;
    });
    if (!lp_kvp.length)
        return;
    for (let kvp of lp_kvp) {
        const parts = kvp.key.split(":");
        const contract_name = parts[1];
        if (parts.length === 3) {
            let entity = await LpPointsEntity.findOne({ where: { vk: parts[2] } });
            if (!entity) {
                entity = new LpPointsEntity();
                entity.vk = parts[2];
                entity.points = {};
            }
            const value = (0, misc_utils_1.getVal)(kvp);
            entity.points[contract_name] = value;
            await entity.save();
        }
        else if (parts.length === 2) {
            let vk = parts[0].split(".")[0];
            let entity = await LpPointsEntity.findOne({ where: { vk } });
            if (!entity) {
                entity = new LpPointsEntity();
                entity.vk = vk;
                entity.points = {};
            }
            const value = (0, misc_utils_1.getVal)(kvp);
            entity.points[contract_name] = value;
            await entity.save();
        }
    }
}
exports.saveUserLp = saveUserLp;
//# sourceMappingURL=lp-points.entity.js.map