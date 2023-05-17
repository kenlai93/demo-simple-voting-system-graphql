import { registerEnumType } from '@nestjs/graphql'

export const FieldConstraints = {
  name: {
    min: 1,
    max: 1024,
  },
}

export const PageInfoConstraints = {
  pageSize: [20, 50, 100],
}

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}
export const SortOrders = Object.values(SortOrder)
registerEnumType(SortOrder, {
  name: 'SortOrder',
})
