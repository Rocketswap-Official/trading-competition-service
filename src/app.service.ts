import { Injectable, OnModuleInit } from '@nestjs/common';
import { config } from './config';
import { CompetitionEntity, createCompetitions, findActiveCompetitions } from './entities/competition.entity';
import { I_CompJson } from './types';
import { log } from './utils/logger';
const fs = require("fs");

@Injectable()
export class AppService implements OnModuleInit {

  async onModuleInit() {
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
    log.log({ active_comps })
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

    createCompetitions(competition_data as I_CompJson[])
    log.log({ competition_data })
  }
}

