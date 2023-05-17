import { hash } from './hash.utils'

describe('hash.util', () => {
  test('should return hashed value', () => {
    const plainTest = 'helloWorld'
    const hashed = hash(plainTest)
    const hashedWithSalt = hash(plainTest, 'salt')
    expect(hashed).not.toEqual(plainTest)
    expect(hashed).not.toEqual(hashedWithSalt)
  })
})
