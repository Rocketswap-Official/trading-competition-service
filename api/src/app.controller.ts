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

  @Get("get_competitions_sorted")
  async getCompetitionsSorted(): Promise<any> {
    const competitions = await findAllCompetitions()
    const results = await findAllUserResults()
    const competitions_w_results = competitions.map(c => { (c as any).results = results.filter(r => r.competition_id === c.id); return c }
    )
    return {
      upcoming: competitions_w_results.filter(c => c.status === "upcoming").sort((a, b) => a.date_start_unix - b.date_start_unix),
      active: competitions_w_results.filter(c => c.status === "active").sort((a, b) => a.date_end_unix - b.date_end_unix),
      finished: competitions_w_results.filter(c => c.status === "finished").sort((a, b) => a.date_end_unix - b.date_end_unix),
    }
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

  @Get("get_competition_winners/:comp_id")
  public async getCompetitionWinners(@Param() params: { comp_id: string }) {
    const { comp_id } = params;
    try {
      return await this.appService.getCompetitionWinners(comp_id)
    } catch (err) {
      log.error(err);
    }
  }
}
