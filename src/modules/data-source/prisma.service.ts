import { INestApplication, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query'],
    })
  }

  private readonly logger = new Logger(PrismaService.name)
  async onModuleInit() {
    this.logger.log('init db conn')
    await this.$connect()
  }

  async onModuleDestroy() {
    this.logger.log('close db conn')
    await this.$disconnect()
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      this.logger.log('close db conn from app destroy')
      await app.close()
    })
  }
}
