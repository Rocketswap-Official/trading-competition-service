import { Injectable, OnModuleInit } from '@nestjs/common';
import { time } from 'console';
import { Between } from 'typeorm';
import { config } from './config';
import { CompetitionEntity, createCompetitions, findActiveCompetitions } from './entities/competition.entity';
import { TradeHistoryEntity } from './entities/core/trade-history.entity';
import { UserResultEntity } from './entities/user-result.entity';
import { I_CompJson } from './types';
import { log } from './utils/logger';
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
      log.log(`updating stats for competition.id : ${comp.id}, ${comp.comp_contract_title}/${comp.reward_contract_title}`)

      const trades = await TradeHistoryEntity.find({ where: { time: Between(comp.date_start_unix / 1000, comp.date_end_unix / 1000), contract_name: comp.comp_contract } })

      const volume_by_vk = trades.reduce((accum, trade) => {
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
          log.log(key)
          log.log(volume_by_vk[key])
          entity.volume_tau = volume_by_vk[key]
          results_to_save.push(entity)
        } else if (entity.volume_tau !== volume_by_vk[key]) {
          entity.volume_tau = volume_by_vk[key]
          results_to_save.push(entity)
        }

        await UserResultEntity.save(results_to_save)
      }
    }
  }

  async loadCompetitions() {
    log.log(`loading competition data`)
    const path = `./src/competitions.json`;
    const competition_data = await new Promise((resolve, reject) => {
      fs.readFile(path, (err, data: any) => {
        if (err) reject(err);
        else resolve(JSON.parse(data));
      });
    }).catch((err) => {
      log.log(`error loading file !`)
    });

    await createCompetitions(competition_data as I_CompJson[])
  }
}

