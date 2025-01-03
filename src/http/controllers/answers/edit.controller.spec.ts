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

  it('should be able to edit a answer', async () => {
    const { token } = await createAndAuthenticateUser(app, false)
    const { question } = await createQuestion(app, token)
    const { answer } = await createAnswer(app, question.id, token)
    const expectedContent = 'New Edited Content of the answer'

    const response = await request(app.server)
      .put(`/answers/${answer.id}`)
      .send({
        content: 'New Edited Content of the answer',
      })
      .set('Authorization', `Bearer ${token}`)

    const content = response.body.answer.content

    expect(response.statusCode).toEqual(202)
    expect(content).toEqual(expectedContent)
  })
})
