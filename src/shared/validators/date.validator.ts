import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator'

export type DateValidationOptions = ValidationOptions & {
  include?: boolean
}

export function IsDateLaterThan(property: string, validationOptions?: DateValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDateLaterThan',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: {
        message: `Field '${propertyName}' must be later than field '${property}'`,
        ...validationOptions,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints
          const relatedValue = args.object[relatedPropertyName]
          if (value instanceof Date && relatedValue instanceof Date) {
            return validationOptions?.include ? value >= relatedValue : value > relatedValue
          }
          return false
        },
      },
    })
  }
}

export function IsDateEarlierThan(property: string, validationOptions?: DateValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDateEarlierThan',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: {
        message: `Field '${propertyName}' must be earlier than field '${property}'`,
        ...validationOptions,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints
          const relatedValue = args.object[relatedPropertyName]
          if (value instanceof Date && relatedValue instanceof Date) {
            return validationOptions?.include ? value <= relatedValue : value < relatedValue
          }
          return false
        },
      },
    })
  }
}
