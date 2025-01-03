import { app } from '@/app'
import { createQuestion } from '@/utils/test/create-a-question'
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

describe('Question - (e2e)', () => {
  beforeEach(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to list questions', async () => {
    await createQuestion(app, false)

    const response = await request(app.server).get(`/questions`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.questions).toHaveLength(1)
  })
})
