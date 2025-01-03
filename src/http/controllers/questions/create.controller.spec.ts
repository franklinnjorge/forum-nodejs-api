import { app } from '@/app'
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

  it('should be able to create a question', async () => {
    const { token } = await createAndAuthenticateUser(app, false)

    const response = await request(app.server)
      .post('/questions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Title of the question',
        content: 'Content of the question',
      })

    expect(response.statusCode).toEqual(201)
  })
})
