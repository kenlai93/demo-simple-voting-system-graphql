import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { Type } from 'class-transformer'
import {
  ArrayNotEmpty,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { PageInfoConstraints, SortOrder, SortOrders } from '../constants/common.constant'

type Newable = new (...args) => any
type InferNewable<T> = T extends new (...args) => infer I ? I : never

@InputType()
export class SortByInput {
  @Field(() => String)
  @IsString()
  sortBy!: string

  @Field(() => SortOrder, {
    defaultValue: SortOrder.Asc,
    nullable: true,
  })
  @IsOptional()
  @IsIn(SortOrders)
  sortOrder?: SortOrder = SortOrder.Asc
}

@InputType()
export class PageInfoInput {
  @Field(() => Int, {
    defaultValue: 1,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  page?: number = 1

  @Field(() => Int, {
    defaultValue: PageInfoConstraints.pageSize[0],
    nullable: true,
  })
  @IsOptional()
  @IsIn(PageInfoConstraints.pageSize)
  pageSize?: number = PageInfoConstraints.pageSize[0]

  @Type(() => SortByInput)
  @ValidateNested({ each: true })
  @IsOptional()
  @ArrayNotEmpty()
  @Field(() => [SortByInput], { nullable: true })
  sortBys?: SortByInput[] | null
}

@ObjectType()
export class SortBy {
  @Field(() => String)
  sortBy!: string

  @Field(() => SortOrder)
  sortOrder!: SortOrder
}

@ObjectType()
export class PageInfo {
  @Field(() => Int)
  page!: number

  @Field(() => Int)
  pageSize!: number

  @Field(() => [SortBy], { nullable: true })
  sortBys?: SortBy[] | null

  @Field(() => Int)
  total!: number
}

export function registerQueryResult<DataDto extends Newable>(dataDto: DataDto) {
  @ObjectType()
  class QueryInput {
    @Field(() => [dataDto])
    data!: InferNewable<DataDto>[]

    @Field(() => PageInfo)
    pageInfo!: PageInfo
  }

  return QueryInput
}
