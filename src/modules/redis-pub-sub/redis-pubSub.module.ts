import { Inject, Module, OnModuleDestroy } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import Redis, { RedisOptions } from 'ioredis'
import { AppRedisConfig, RedisConfig } from 'src/config'
import { InjectionToken } from 'src/shared/constants/injection-token.constant'

@Module({
  imports: [ConfigModule.forFeature(RedisConfig)],
  providers: [
    {
      provide: InjectionToken.PubSub,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppRedisConfig, true>) => {
        const options: RedisOptions = {
          password: configService.get('REDIS_PASSWORD'),
        }
        return new RedisPubSub({
          publisher: new Redis(configService.get('REDIS_URL'), options),
          subscriber: new Redis(configService.get('REDIS_URL'), options),
        })
      },
    },
  ],
  exports: [InjectionToken.PubSub],
})
export class RedisPubSubModule implements OnModuleDestroy {
  constructor(@Inject(InjectionToken.PubSub) private pubSub: RedisPubSub) {}

  async onModuleDestroy() {
    await this.pubSub.close()
  }
}
