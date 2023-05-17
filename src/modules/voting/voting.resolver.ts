import { Logger } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { Vote, VoteInput } from './voting.dto'
import { VotingService } from './voting.service'

@Resolver()
export class VotingResolver {
  private readonly logger = new Logger(VotingResolver.name)

  constructor(private votingService: VotingService) {}

  @Mutation(() => Vote)
  async vote(@Args('input') voteInput: VoteInput): Promise<Vote> {
    this.logger.log('vote')
    this.logger.log('campaignId', voteInput.campaignId)
    this.logger.log('choiceId', voteInput.choiceId)

    const vote = await this.votingService.vote(voteInput)

    return vote
  }
}
