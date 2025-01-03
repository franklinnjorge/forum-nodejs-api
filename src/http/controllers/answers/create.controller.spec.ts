import { app } from '@/app'
import { createQuestion } from '@/utils/test/create-a-question'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

describe('Answer - (e2e)', () => {
  beforeEach(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to create a answer', async () => {
    const { token } = await createAndAuthenticateUser(app, false)
    const { question } = await createQuestion(app, token)

    const response = await request(app.server)
      .post(`/answers/${question.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Content of the answer',
      })

    expect(response.statusCode).toEqual(201)
  })
})
