import { BadRequestException, ConflictException, Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PubSubEngine } from 'graphql-subscriptions'
import { AppSecurityConfig } from 'src/config'
import { SubscriptionEventName } from 'src/shared/constants/event.constant'
import { InjectionToken } from 'src/shared/constants/injection-token.constant'
import { hash } from 'src/shared/utilities/hash.utils'
import { LiveCampaignData } from '../campaign/campaign.dto'
import { PrismaService } from '../data-source/prisma.service'
import { VoteInput } from './voting.dto'

@Injectable()
export class VotingService {
  private readonly logger = new Logger(VotingService.name)

  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService<AppSecurityConfig, true>,
    @Inject(InjectionToken.PubSub) private pubSub: PubSubEngine
  ) {}

  async vote({ campaignId, choiceId, hkid }: VoteInput) {
    const hashedHKID = hash(hkid, this.configService.get('SALT'))

    const now = new Date()
    const vote = await this.prismaService.$transaction(async ($prisma) => {
      const vote$ = $prisma.vote
        .create({
          data: {
            hkid: hashedHKID,
            campaignId,
            choiceId,
          },
        })
        .catch((error) => {
          throw error?.code === 'P2002'
            ? new ConflictException('Already voted this campaign.')
            : error
        })

      const incrCount$ = $prisma
        .$runCommandRaw({
          update: 'Campaign',
          updates: [
            {
              q: {
                _id: { $oid: campaignId },
                startTime: { $lte: { $date: now.toISOString() } },
                endTime: { $gte: { $date: now.toISOString() } },
                'choices.id': { $in: [choiceId] },
              },
              u: {
                $inc: {
                  'choices.$[choiceEle].count': 1,
                  totalVote: 1,
                },
              },
              arrayFilters: [{ 'choiceEle.id': choiceId }],
            },
          ],
        })
        .then((result) => {
          this.logger.debug('result', JSON.stringify(result))
          if (result.nModified === 0) {
            throw new BadRequestException(
              'Campaign/Choice not found, or campaign has end already/not started yet.'
            )
          }
          return result
        })

      const [vote] = await Promise.all([vote$, incrCount$])
      return vote
    })

    // no await
    this.publishLiveCampaignData(campaignId)

    return vote
  }

  private async publishLiveCampaignData(campaignId: string) {
    this.logger.log('publishLiveCampaignData', campaignId)
    try {
      const campaign = await this.prismaService.campaign.findFirst({
        where: { id: campaignId },
      })
      if (campaign) {
        const liveCampaignData: LiveCampaignData = {
          id: campaignId,
          choices: campaign.choices,
          totalVote: campaign.totalVote,
        }
        await this.pubSub.publish(SubscriptionEventName.NewVote, {
          subscribeLiveCampaignData: liveCampaignData,
        })
        this.logger.log('liveCampaignData published')
      }
      this.logger.log('campaign not found')
    } catch (error) {
      this.logger.warn('failed to publish liveCampaignData', error)
    }
  }
}
