import { Campaign } from '@prisma/client'

export const CampaignSortByWhiteList: Array<keyof Campaign> = [
  'id',
  'createdAt',
  'updatedAt',
  'desc',
  'name',
  'startTime',
  'endTime',
  'totalVote',
]
