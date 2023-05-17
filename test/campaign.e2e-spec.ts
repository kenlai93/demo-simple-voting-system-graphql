import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { print } from 'graphql'
import { gql } from 'graphql-tag'
import { setupApp } from 'src/setup'
import request from 'supertest'
import { AppModule } from '../src/app.module'

describe('Campaign (e2e)', () => {
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

  it('should return campaigns in queryCampaign', () => {
    const payload = {
      variables: { filter: {} },
      query: print(gql`
        query ($filter: QueryCampaignFilter!) {
          queryCampaign(filter: $filter) {
            data {
              id
              name
              totalVote
              startTime
              endTime
              choices {
                name
                count
              }
            }
            pageInfo {
              page
              pageSize
              sortBy
              sortOrder
              total
            }
          }
        }
      `),
    }
    return request(app.getHttpServer())
      .post('/graphql')
      .send(payload)
      .expect(({ body }) => {
        // console.log('body', JSON.stringify(body, null, 2))
        expect(body.data.queryCampaign.data.length).toBeGreaterThan(0)
        expect(body.error).toBeUndefined()
      })
  })
})
