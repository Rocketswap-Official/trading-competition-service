"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockDTO = exports.handleNewBlock = exports.initSocket = void 0;
const io = require("socket.io-client");
const last_block_entity_1 = require("../entities/core/last-block.entity");
const logger_1 = require("../utils/logger");
const block_service_1 = require("./block.service");
let init = false;
function initSocket(parseBlockFn) {
    const block_service_url = `http://${block_service_1.BlockService.get_block_service_url()}`;
    const socket = io(block_service_url, {
        reconnectionDelayMax: 10000
    });
    socket.on("connect", () => {
        logger_1.log.log(`Connected to Blockservice via socket.io @ ${block_service_url}`);
        logger_1.log.log({ init });
        if (!init) {
            socket.emit("join", "new-block");
            socket.on("new-block", async (payload) => {
                const parsed = JSON.parse(payload);
                const bs_block = parsed.message;
                await handleNewBlock(bs_block, parseBlockFn);
            });
            init = true;
        }
    });
    socket.io.on("reconnect", (attempt) => {
        logger_1.log.log({ attempt });
    });
    socket.io.on("reconnect_attempt", (attempt) => {
        logger_1.log.log({ attempt });
    });
    socket.io.on("error", (error) => {
        logger_1.log.log({ error });
    });
}
exports.initSocket = initSocket;
async function handleNewBlock(block, parseBlockFn) {
    var _a;
    const has_transaction = block.subblocks.length && block.subblocks[0].transactions.length;
    if (!has_transaction)
        return;
    const { subblocks, number: block_num } = block;
    for (let sb of subblocks) {
        const { transactions } = sb;
        for (let t of transactions) {
            logger_1.log.log({ t });
            const { state, hash, transaction } = t;
            const fn = transaction.payload.function;
            const { contract } = transaction.payload;
            const { timestamp } = transaction.metadata;
            const block_obj = { state, hash, fn, contract, timestamp };
            if ((_a = Object.keys(state)) === null || _a === void 0 ? void 0 : _a.length) {
                await parseBlockFn(block_obj);
            }
        }
    }
    await (0, last_block_entity_1.updateLastBlock)({ block_num });
}
exports.handleNewBlock = handleNewBlock;
class BlockDTO {
}
exports.BlockDTO = BlockDTO;
//# sourceMappingURL=socket-client.provider.js.map