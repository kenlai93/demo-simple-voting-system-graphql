import { PageInfo, PageInfoInput } from '../dtos/common.dto'

export function buildPaginationParam({ page, pageSize, sortBys }: PageInfoInput = {}) {
  return {
    ...(page &&
      pageSize && {
        skip: (page - 1) * pageSize,
      }),
    ...(pageSize && {
      take: pageSize,
    }),
    ...(sortBys?.length && {
      orderBy: sortBys.map(({ sortBy, sortOrder }) => ({
        [sortBy]: sortOrder,
      })),
    }),
  }
}

export function buildPageInfo(pageInfoInput: PageInfoInput, total: number) {
  return {
    ...new PageInfoInput(),
    ...pageInfoInput,
    total,
  } as PageInfo
}
