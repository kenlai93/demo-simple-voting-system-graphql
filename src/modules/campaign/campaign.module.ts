import { Module } from '@nestjs/common'
import { DataSourceModules } from '../data-source/data-source.module'
import { RedisPubSubModule } from '../redis-pub-sub/redis-pubSub.module'
import { CampaignResolver } from './campaign.resolver'
import { CampaignService } from './campaign.service'

@Module({
  imports: [RedisPubSubModule, DataSourceModules],
  providers: [CampaignResolver, CampaignService],
})
export class CampaignModule {}
