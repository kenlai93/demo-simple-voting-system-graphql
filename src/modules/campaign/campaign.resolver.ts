import { Inject, Logger, NotFoundException } from '@nestjs/common'
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql'
import { PubSubEngine } from 'graphql-subscriptions'
import { SubscriptionEventName } from 'src/shared/constants/event.constant'
import { InjectionToken } from 'src/shared/constants/injection-token.constant'
import { PageInfoInput } from 'src/shared/dtos/common.dto'
import { buildPageInfo } from 'src/shared/utilities/pagination.utils'
import {
  Campaign,
  CreateCampaignInput,
  GetCampaignArgs,
  LiveCampaignData,
  QueryCampaignFilter,
  QueryCampaignResult,
} from './campaign.dto'
import { CampaignService } from './campaign.service'
import { SortByPipe } from 'src/shared/pipes/sort-by.pipe'
import { CampaignSortByWhiteList } from './campaign.constant'

@Resolver()
export class CampaignResolver {
  private readonly logger = new Logger(CampaignResolver.name)

  constructor(
    @Inject(InjectionToken.PubSub) private pubSub: PubSubEngine,
    private campaignService: CampaignService
  ) {}

  @Mutation(() => Campaign)
  async createCampaign(@Args('newCampaign') newCampaign: CreateCampaignInput): Promise<Campaign> {
    this.logger.log('createCampaign')
    this.logger.log('newCampaign', JSON.stringify(newCampaign))

    const campaign = await this.campaignService.createCampaign(newCampaign)
    return campaign
  }

  @Query(() => Campaign)
  async getCampaign(@Args() { campaignId }: GetCampaignArgs): Promise<Campaign> {
    this.logger.log('getCampaign')
    this.logger.log('campaignId', campaignId)

    const campaign = await this.campaignService.getCampaignById(campaignId)

    if (!campaign) {
      throw new NotFoundException('Campaign not found.')
    }

    return campaign
  }

  @Query(() => QueryCampaignResult)
  async queryCampaign(
    @Args('filter') filter: QueryCampaignFilter,
    @Args('pageInfo', { nullable: true }, new SortByPipe(CampaignSortByWhiteList))
    pageInfo: PageInfoInput = new PageInfoInput()
  ): Promise<QueryCampaignResult> {
    this.logger.log('queryCampaign')
    this.logger.log('filter', JSON.stringify(filter))
    this.logger.log('pageInfo', JSON.stringify(pageInfo))

    const [campaigns, total] = await this.campaignService.queryCampaigns(filter, pageInfo)

    return {
      data: campaigns,
      pageInfo: buildPageInfo(pageInfo, total),
    }
  }

  @Subscription(() => LiveCampaignData)
  subscribeLiveCampaignData() {
    return this.pubSub.asyncIterator(SubscriptionEventName.NewVote)
  }
}
