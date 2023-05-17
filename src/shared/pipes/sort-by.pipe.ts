import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common'
import { PageInfoInput } from '../dtos/common.dto'

@Injectable()
export class SortByPipe implements PipeTransform {
  constructor(private whiteList: string[]) {}

  transform(value: PageInfoInput, metadata: ArgumentMetadata) {
    if (metadata.metatype?.name !== PageInfoInput.name) {
      throw new Error('SortByPipe is only allowed for PageInfoInput')
    }
    if (value.sortBys) {
      for (const { sortBy } of value.sortBys) {
        if (!this.whiteList.includes(sortBy)) {
          throw new BadRequestException(
            `Field "sortBy" only allow ${JSON.stringify(this.whiteList)}`
          )
        }
      }
    }

    return value
  }
}
