import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { Transform } from 'class-transformer'
import { IsMongoId, IsString, IsUUID } from 'class-validator'
import { IsHKID } from 'src/shared/validators/isHKID.validator'

@ObjectType()
export class Vote {
  @Field()
  campaignId!: string

  @Field()
  choiceId!: string

  @Field()
  createdAt!: Date
}

@InputType()
export class VoteInput {
  @IsMongoId()
  @Field()
  campaignId!: string

  @IsUUID()
  @Field()
  choiceId!: string

  @IsString()
  @IsHKID()
  @Transform(({ value }) => {
    // normalize parenthesis
    const pattern = /\(([0-9A])\)$/
    if (pattern.test(value)) {
      return value.replace(pattern, (_, $2) => $2)
    }
    return value
  })
  @Field()
  hkid!: string
}
