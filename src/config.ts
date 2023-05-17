import { registerAs } from '@nestjs/config'
import assert from 'assert'

export type AppConfig = AppRedisConfig & AppSecurityConfig

export type AppRedisConfig = {
  REDIS_URL: string
  REDIS_PASSWORD: string
}
export const RedisConfig = registerAs<AppRedisConfig>('RedisConfig', () => {
  const { REDIS_URL, REDIS_PASSWORD } = process.env
  assert.ok(REDIS_URL, 'env "REDIS_URL" is undefined')
  assert.ok(REDIS_PASSWORD, 'env "REDIS_PASSWORD" is undefined')
  return {
    REDIS_URL,
    REDIS_PASSWORD,
  }
})

export type AppSecurityConfig = {
  SALT: string
}
export const SecurityConfig = registerAs<AppSecurityConfig>('SecurityConfig', () => {
  const { SALT } = process.env
  assert.ok(SALT, 'env "SALT" is undefined')
  return {
    SALT,
  }
})
