"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var BlockService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("../config");
let BlockService = BlockService_1 = class BlockService {
};
BlockService.bs_index = 0;
BlockService.block_service_urls = config_1.config.block_service_urls;
BlockService.get_block_service_url = () => BlockService_1.block_service_urls[BlockService_1.bs_index];
BlockService.switchBlockServiceUrl = () => {
    if (config_1.config.block_service_urls.length === 1)
        return;
    if (BlockService_1.bs_index === BlockService_1.block_service_urls.length - 1) {
        BlockService_1.bs_index = 0;
        return;
    }
    BlockService_1.bs_index++;
};
BlockService = BlockService_1 = __decorate([
    (0, common_1.Injectable)()
], BlockService);
exports.BlockService = BlockService;
//# sourceMappingURL=block.service.js.map