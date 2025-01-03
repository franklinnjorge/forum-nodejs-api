import { app } from '@/app'
import { createAnswer } from '@/utils/test/create-a-answer'
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

  it('should be able to delete a answer', async () => {
    const { token } = await createAndAuthenticateUser(app, false)
    const { question } = await createQuestion(app, token)
    const { answer } = await createAnswer(app, question.id, token)

    const response = await request(app.server)
      .delete(`/answers/${answer.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
  })
})
