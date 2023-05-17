import { ArgsType, Field, ID, InputType, Int, ObjectType, PickType } from '@nestjs/graphql'
import { Type } from 'class-transformer'
import {
  ArrayNotEmpty,
  IsDate,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { registerQueryResult } from 'src/shared/dtos/common.dto'
import { IsDateEarlierThan, IsDateLaterThan } from 'src/shared/validators/date.validator'

@ObjectType()
export class VotingChoice {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field(() => Int)
  count!: number
}

@ObjectType()
export class Campaign {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field(() => String, { nullable: true })
  desc?: string | null

  @Field(() => [VotingChoice])
  choices!: VotingChoice[]

  @Field(() => Int)
  totalVote!: number

  @Field()
  startTime!: Date

  @Field()
  endTime!: Date

  @Field()
  createdAt!: Date

  @Field()
  updatedAt!: Date
}

@ArgsType()
export class GetCampaignArgs {
  @IsMongoId()
  @Field()
  campaignId!: string
}

@InputType()
export class CreateCampaignChoiceInput {
  @Field()
  @IsString()
  name!: string
}

@InputType()
export class CreateCampaignInput {
  @Field()
  @IsString()
  name!: string

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  desc?: string | null

  @Field(() => [CreateCampaignChoiceInput])
  @Type(() => CreateCampaignChoiceInput)
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  choices!: CreateCampaignChoiceInput[]

  @Field()
  @IsDate()
  @IsDateEarlierThan('endTime')
  startTime!: Date

  @Field()
  @IsDate()
  @IsDateLaterThan('startTime')
  endTime!: Date
}

@InputType()
export class QueryCampaignFilter {
  @Field(() => ID, {
    nullable: true,
  })
  @IsOptional()
  @IsString()
  id?: string | null

  @Field(() => String, {
    nullable: true,
  })
  @IsOptional()
  @IsString()
  name?: string | null

  @Field(() => String, {
    nullable: true,
  })
  @IsOptional()
  @IsString()
  choiceName?: string | null
}

@ObjectType()
export class QueryCampaignResult extends registerQueryResult(Campaign) {}

@ObjectType()
export class LiveCampaignData extends PickType(Campaign, ['id', 'choices', 'totalVote']) {}
