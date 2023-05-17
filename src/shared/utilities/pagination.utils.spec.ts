import { PageInfoConstraints, SortOrder } from '../constants/common.constant'
import { PageInfoInput } from '../dtos/common.dto'
import { buildPageInfo, buildPaginationParam } from './pagination.utils'

describe('pagination.utils', () => {
  test('should buildPageInfo for empty PageInfoInput', () => {
    const total = 20
    const pageInfoInput: PageInfoInput = {}
    const pageInfo = buildPageInfo(pageInfoInput, total)

    expect(pageInfo.page).toEqual(1)
    expect(pageInfo.pageSize).toBe(pageInfoInput.pageSize ?? PageInfoConstraints.pageSize[0])
    expect(pageInfo.sortBys).toStrictEqual(pageInfoInput.sortBys)
  })

  test('should build where clause from pageInfoInput', () => {
    const pageInfoInput: Required<PageInfoInput> = {
      page: 2,
      pageSize: 20,
      sortBys: [{ sortBy: 'id', sortOrder: SortOrder.Asc }],
    }
    const where = buildPaginationParam(pageInfoInput)

    expect(where.take).toBe(pageInfoInput.pageSize)
    expect(where.skip).toBe((pageInfoInput.page - 1) * pageInfoInput.pageSize)
    expect(where.orderBy).toStrictEqual(
      pageInfoInput.sortBys?.map(({ sortBy, sortOrder }) => ({ [sortBy]: sortOrder }))
    )
  })
})
