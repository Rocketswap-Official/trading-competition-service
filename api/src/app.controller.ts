import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { findAllCompetitions } from './entities/competition.entity';
import { findAllUserResults } from './entities/user-result.entity';
import { log } from './utils/logger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get("get_competitions")
  async getCompetitions(): Promise<any> {
    const competitions = await findAllCompetitions()
    const results = await findAllUserResults()
    return competitions.map(c => { (c as any).results = results.filter(r => r.competition_id === c.id); return c }
    )
  }

  @Get("get_token_info/:contract_name")
  public async getMarketSummary(@Param() params: { contract_name: string }) {
    const { contract_name } = params;
    try {
      const token_info = this.appService.getTokenInfo(contract_name)
      return token_info
    } catch (err) {
      log.error(err);
    }
  }
}
