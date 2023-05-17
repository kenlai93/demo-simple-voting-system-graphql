import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SecurityConfig } from 'src/config'
import { DataSourceModules } from '../data-source/data-source.module'
import { RedisPubSubModule } from '../redis-pub-sub/redis-pubSub.module'
import { VotingResolver } from './voting.resolver'
import { VotingService } from './voting.service'

@Module({
  imports: [ConfigModule.forFeature(SecurityConfig), RedisPubSubModule, DataSourceModules],
  providers: [VotingResolver, VotingService],
})
export class VotingModule {}
