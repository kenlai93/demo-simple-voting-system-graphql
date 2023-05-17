import { createHash } from 'crypto'

export function hash(plainText: string, salt = '') {
  const hashed = createHash('sha256').update(`${plainText}${salt}`).digest('base64')
  return hashed
}
