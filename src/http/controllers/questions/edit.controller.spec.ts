import { app } from '@/app'
import { createQuestion } from '@/utils/test/create-a-question'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

describe('Question - (e2e)', () => {
  beforeEach(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to edit a question', async () => {
    const { token } = await createAndAuthenticateUser(app, false)
    const { question } = await createQuestion(app, token)
    const expectedTitle = 'New Title of the question edited'

    const response = await request(app.server)
      .put(`/questions/${question.id}`)
      .send({
        title: expectedTitle,
        content: 'New Edited Content of the question',
      })
      .set('Authorization', `Bearer ${token}`)

    const title = response.body.question.title

    expect(response.statusCode).toEqual(202)
    expect(title).toEqual(expectedTitle)
  })
})
