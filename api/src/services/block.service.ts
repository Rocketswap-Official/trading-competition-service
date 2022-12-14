import { Injectable, OnModuleInit } from "@nestjs/common";
import { config } from "../config";
import { log } from "../utils/logger";

@Injectable()
export class BlockService {

	private static bs_index = 0;
	private static block_service_urls = config.block_service_urls;
	public static get_block_service_url = () => BlockService.block_service_urls[BlockService.bs_index];

	public static switchBlockServiceUrl = () => {
		if (config.block_service_urls.length === 1) return;
		if (BlockService.bs_index === BlockService.block_service_urls.length - 1) {
			BlockService.bs_index = 0;
			return;
		}
		BlockService.bs_index++;
	};
}
