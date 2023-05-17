import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { print } from 'graphql'
import { gql } from 'graphql-tag'
import { setupApp } from 'src/setup'
import request from 'supertest'
import { AppModule } from '../src/app.module'
import { VoteInput } from 'src/modules/voting/voting.dto'

describe('Voting (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    setupApp(app)
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  const query = print(gql`
    mutation ($input: VoteInput!) {
      vote(input: $input) {
        campaignId
        choiceId
        createdAt
      }
    }
  `)

  it('should return voted campaign and choice', () => {
    const variables: VoteInput = {
      campaignId: '64622f7186a2e8ceaf0b4e07',
      choiceId: '5f4f1728-ce01-45c8-8bcb-43f0cb947ffa',
      hkid: 'H899554(2)',
    }

    return request(app.getHttpServer())
      .post('/graphql')
      .send({ variables, query })
      .expect(({ body }) => {
        // console.log('body', JSON.stringify(body, null, 2))
        expect(body.data.vote.campaignId).toEqual(variables.campaignId)
        expect(body.error).toBeUndefined()
      })
  })

  it('should not allowed to double vote', () => {
    const variables: VoteInput = {
      campaignId: '64622f7186a2e8ceaf0b4e07',
      choiceId: '22fef14a-50ff-4859-b454-56822abfde44',
      hkid: 'L337146(2)',
    }

    return request(app.getHttpServer())
      .post('/graphql')
      .send({ variables, query })
      .expect(() =>
        request(app.getHttpServer())
          .post('/graphql')
          .send({ variables, query })
          .expect(({ body }) => {
            expect(body.error[0]?.extensions?.status).toEqual(409)
          })
      )
  })

  it('should not allowed to vote on expired campaign', () => {
    const variables: VoteInput = {
      campaignId: '64622f7f86a2e8ceaf0b4e08',
      choiceId: '912c12c8-5bd4-4e0a-a99f-2a7620ef42e2',
      hkid: 'H899554(2)',
    }

    return request(app.getHttpServer())
      .post('/graphql')
      .send({ variables, query })
      .expect(({ body }) => {
        // console.log('body', JSON.stringify(body, null, 2))
        expect(body.data.vote.campaignId).toEqual(variables.campaignId)
        expect(body.error).toBeUndefined()
      })
  })

  it('should not allowed to vote on nonExisting campaign/choice', () => {
    const variables: VoteInput = {
      campaignId: '646107ed5f5ea105bd100c0d',
      choiceId: '16aad47e-9fed-46ff-a3a8-07582f5ba445',
      hkid: 'H899554(2)',
    }

    return request(app.getHttpServer())
      .post('/graphql')
      .send({ variables, query })
      .expect(({ body }) => {
        // console.log('body', JSON.stringify(body, null, 2))
        expect(body.data.vote.campaignId).toEqual(variables.campaignId)
        expect(body.error).toBeUndefined()
      })
  })
})
