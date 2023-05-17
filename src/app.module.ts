import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { HttpException, InternalServerErrorException, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import path from 'path'
import { CampaignModule } from './modules/campaign/campaign.module'
import { VotingModule } from './modules/voting/voting.module'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // enable for demo
      playground: true,
      // enable for demo
      introspection: true,
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
      formatError(formattedError, { originalError }: any) {
        let message = InternalServerErrorException.name
        let code = InternalServerErrorException.name
        if (originalError instanceof HttpException) {
          message = originalError.message
          code = originalError.name
        } else {
          // unhandled error
          console.error(originalError)
        }
        return {
          ...formattedError,
          message,
          extensions: {
            code,
          },
        }
      },
    }),
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`],
    }),
    CampaignModule,
    VotingModule,
  ],
})
export class AppModule {}
