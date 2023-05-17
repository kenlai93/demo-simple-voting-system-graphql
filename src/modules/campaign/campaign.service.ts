import { Injectable, Logger } from '@nestjs/common'
import { Campaign, Prisma } from '@prisma/client'
import { PageInfoInput } from 'src/shared/dtos/common.dto'
import { buildPaginationParam } from 'src/shared/utilities/pagination.utils'
import { PrismaService } from '../data-source/prisma.service'
import { CreateCampaignInput, QueryCampaignFilter } from './campaign.dto'

@Injectable()
export class CampaignService {
  private readonly logger = new Logger(CampaignService.name)
  constructor(private prismaService: PrismaService) {}

  async getCampaignById(campaignId: string) {
    this.logger.log('campaignId', campaignId)

    const campaign = await this.prismaService.campaign.findUnique({
      where: {
        id: campaignId,
      },
    })

    return campaign
  }

  async queryCampaigns(
    filter: QueryCampaignFilter,
    pageInfo: PageInfoInput
  ): Promise<[Campaign[], number]> {
    this.logger.log('filter', JSON.stringify(filter))
    this.logger.log('pageInfo', JSON.stringify(pageInfo))

    const where: Prisma.CampaignWhereInput = {
      ...(filter.id && {
        id: filter.id,
      }),
      ...(filter.name && {
        name: {
          contains: filter.name,
          mode: 'insensitive',
        },
      }),
      ...(filter.choiceName && {
        choices: {
          some: {
            name: {
              contains: filter.choiceName,
              mode: 'insensitive',
            },
          },
        },
      }),
    }

    const campaigns$ = this.prismaService.campaign.findMany({
      where,
      ...buildPaginationParam(pageInfo),
    })
    const total$ = this.prismaService.campaign.count({
      where,
    })
    const [campaigns, total] = await this.prismaService.$transaction([campaigns$, total$])
    return [campaigns, total]
  }

  async createCampaign(newCampaign: CreateCampaignInput) {
    this.logger.log('newCampaign', JSON.stringify(newCampaign))

    const campaign = await this.prismaService.campaign.create({
      data: {
        name: newCampaign.name,
        startTime: newCampaign.startTime,
        endTime: newCampaign.endTime,
        choices: newCampaign.choices.map((choice) => ({
          name: choice.name,
        })),
      },
    })
    return campaign
  }
}
