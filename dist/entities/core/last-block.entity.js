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
exports.startTrimLastBlocksTask = exports.getLastProcessedBlock = exports.updateLastBlock = exports.LastBlockEntity = void 0;
const typeorm_1 = require("typeorm");
const logger_1 = require("../../utils/logger");
let LastBlockEntity = class LastBlockEntity extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], LastBlockEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", Number)
], LastBlockEntity.prototype, "last_block", void 0);
LastBlockEntity = __decorate([
    (0, typeorm_1.Entity)()
], LastBlockEntity);
exports.LastBlockEntity = LastBlockEntity;
async function updateLastBlock(args) {
    try {
        const { block_num } = args;
        let entity = new LastBlockEntity();
        entity.last_block = block_num;
        await entity.save();
        logger_1.log.log(`saved block_num: ${block_num}`);
    }
    catch (err) {
        logger_1.log.warn({ err });
    }
}
exports.updateLastBlock = updateLastBlock;
async function getLastProcessedBlock() {
    var _a;
    return (_a = (await LastBlockEntity.findOne({
        order: { last_block: "DESC" }
    }))) === null || _a === void 0 ? void 0 : _a.last_block;
}
exports.getLastProcessedBlock = getLastProcessedBlock;
async function startTrimLastBlocksTask() {
    setInterval(async () => {
        const blocks = await LastBlockEntity.find({
            order: { last_block: "DESC" }
        });
        if (blocks.length > 1) {
            for (let i = 1; i <= blocks.length; i++) {
                if (blocks[i]) {
                    await blocks[i].remove();
                }
            }
        }
    }, 1000000);
}
exports.startTrimLastBlocksTask = startTrimLastBlocksTask;
//# sourceMappingURL=last-block.entity.js.map