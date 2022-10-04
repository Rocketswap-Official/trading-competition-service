import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompetitionEntity } from './entities/competition.entity';
import { LastBlockEntity } from './entities/core/last-block.entity';
import { LpPointsEntity } from './entities/core/lp-points.entity';
import { PairEntity } from './entities/core/pair.entity';
import { TradeHistoryEntity } from './entities/core/trade-history.entity';
import { UserResultEntity } from './entities/user-result.entity';
import { BlockService } from './services/block.service';
import { DataSyncProvider } from './services/data-sync.provider';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [LastBlockEntity, PairEntity, TradeHistoryEntity, LpPointsEntity, CompetitionEntity, UserResultEntity],
      synchronize: true,
      autoLoadEntities: true
    }),
  ], controllers: [AppController],
  providers: [AppService, DataSyncProvider, BlockService],
})
export class AppModule { }