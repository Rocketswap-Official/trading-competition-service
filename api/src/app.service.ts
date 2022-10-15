import { Injectable, OnModuleInit } from '@nestjs/common';
import { time } from 'console';
import { Between } from 'typeorm';
import { config } from './config';
import { CompetitionEntity, createCompetitions, findActiveCompetitions } from './entities/competition.entity';
import { TradeHistoryEntity } from './entities/core/trade-history.entity';
import { UserResultEntity } from './entities/user-result.entity';
import { I_TradingComp } from './types';
import { log } from './utils/logger';
import { calcMissedWindows, calcSecondsInResolution } from './utils/misc-utils';

const fs = require("fs");

@Injectable()
export class AppService implements OnModuleInit {

  async onModuleInit() {
    await CompetitionEntity.clear()
    await UserResultEntity.clear()
    await this.loadCompetitions()
    this.createUpdateCompStatsTimer()
  }

  createUpdateCompStatsTimer() {
    const timer = setTimeout(async () => {
      await this.updateCompStats()
      this.createUpdateCompStatsTimer()
    }, config.frequency)
  }

  async updateCompStats() {
    log.log(`updating comp stats`)
    const active_comps = await findActiveCompetitions()

    for (let comp of active_comps) {
      if (comp.type === "basic") await this.processBasicComp(comp)
      else if (comp.type === "windowed") await this.processWindowedComp(comp)
    }
  }

  private async processWindowedComp(comp: CompetitionEntity) {
    log.log(`updating : ${comp.type} :: ${comp.id} :: ${comp.comp_contract_title}/${comp.reward_contract_title}`)
    const book_end = comp.date_end_unix >= Date.now() ? Date.now() : comp.date_end_unix
    const trades = await TradeHistoryEntity.find({ where: { time: Between(comp.date_start_unix / 1000, comp.date_end_unix / 1000), contract_name: comp.comp_contract } })
    const trades_filtered = trades.filter(t => !config.blacklisted_addresses.includes(t.vk))
    const seconds_resolution = calcSecondsInResolution(comp.chunk_window)
    const total_number_of_windows = Math.floor(((comp.date_end_unix - comp.date_start_unix) / 1000) / seconds_resolution)
    const number_of_complete_windows = Math.floor(((book_end - comp.date_start_unix) / 1000) / seconds_resolution)

    const volume_by_vk = trades_filtered.reduce((accum, trade) => {
      accum[trade.vk] = accum[trade.vk] ? accum[trade.vk] + (Number(trade.amount) * Number(trade.price)) : Number(trade.amount) * Number(trade.price)
      return accum
    }, {})

    const results_to_save = []
    const existing_user_results = await UserResultEntity.find({ where: { competition_id: comp.id } })

    for (let key of Object.keys(volume_by_vk)) {
      let entity = existing_user_results.find(r => r.user_vk === key)

      if (!entity) {
        entity = new UserResultEntity()
        entity.user_vk = key
        entity.competition_id = comp.id
        entity.volume_tau = volume_by_vk[key]
        entity.competition_type = comp.type
        results_to_save.push(entity)
      } else if (entity.volume_tau !== volume_by_vk[key]) {
        entity.volume_tau = volume_by_vk[key]
        results_to_save.push(entity)
      }

      let user_trades = trades_filtered.filter(t => t.vk == key)

      const missed_windows = calcMissedWindows(user_trades, comp.date_start_unix, seconds_resolution, number_of_complete_windows)
      const missed_windows_above_threshold = missed_windows - comp.missed_window_threshold

      let volume_tau_penalty_pct = 0
      if (missed_windows_above_threshold > 0) volume_tau_penalty_pct = missed_windows_above_threshold * comp.missed_window_penalty_pct

      entity.missed_windows = missed_windows
      entity.missed_window_above_threshold = missed_windows - comp.missed_window_threshold
      entity.missed_window_pct = (missed_windows / total_number_of_windows) * 100
      entity.volume_tau_penalty = entity.volume_tau * ((volume_tau_penalty_pct > 100 ? 100 : volume_tau_penalty_pct) / 100)
      entity.volume_tau_net = entity.volume_tau - entity.volume_tau_penalty

      await UserResultEntity.save(results_to_save)
    }
  }

  private async processBasicComp(comp: CompetitionEntity) {
    log.log(`updating : ${comp.type} :: ${comp.id} :: ${comp.comp_contract_title}/${comp.reward_contract_title}`)

    const trades = await TradeHistoryEntity.find({ where: { time: Between(comp.date_start_unix / 1000, comp.date_end_unix / 1000), contract_name: comp.comp_contract } })
    const trades_filtered = trades.filter(t => !config.blacklisted_addresses.includes(t.vk))
    const volume_by_vk = trades_filtered.reduce((accum, trade) => {
      accum[trade.vk] = accum[trade.vk] ? accum[trade.vk] + (Number(trade.amount) * Number(trade.price)) : Number(trade.amount) * Number(trade.price)
      return accum
    }, {})

    const results_to_save = []
    const existing_user_results = await UserResultEntity.find({ where: { competition_id: comp.id } })

    for (let key of Object.keys(volume_by_vk)) {
      let entity = existing_user_results.find(r => r.user_vk === key)

      if (!entity) {
        entity = new UserResultEntity()
        entity.user_vk = key
        entity.competition_id = comp.id
        entity.competition_type = comp.type
        entity.volume_tau = volume_by_vk[key]
        entity.competition_type = comp.type
        results_to_save.push(entity)
      } else if (entity.volume_tau !== volume_by_vk[key]) {
        entity.volume_tau = volume_by_vk[key]
        results_to_save.push(entity)
      }
      await UserResultEntity.save(results_to_save)
    }
  }

  public async getTokenInfo(contract_name: string) {
    const path = `./src/token-infos.json`;
    const all_token_info = await new Promise((resolve, reject) => {
      fs.readFile(path, (err, data: any) => {
        if (err) reject(err);
        else resolve(JSON.parse(data));
      });
    }).catch((err) => {
      log.log(`error loading file !`)
    });
    return all_token_info[contract_name]
  }

  async loadCompetitions() {
    log.log(`loading competition data`)
    const path = `./src/competitions.json`;
    const competition_data = await new Promise((resolve, reject) => {
      fs.readFile(path, (err, data: any) => {
        if (err) reject(err);
        else resolve(JSON.parse(data) as I_TradingComp[]);
      });
    }).catch((err) => {
      log.log(`error loading file !`)
    });

    await createCompetitions(competition_data as I_TradingComp[])
  }
}

