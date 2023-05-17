import { ValidationOptions, registerDecorator } from 'class-validator'
import validid from 'validid'

export function IsHKID(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isHKID',
      target: object.constructor,
      propertyName,
      options: {
        message: `Field '${propertyName}' is not a valid HKID.`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return typeof value === 'string' && validid.hkid(value)
        },
      },
    })
  }
}
