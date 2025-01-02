import { app } from '@/app'
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

describe('Authenticate - (e2e)', () => {
  beforeEach(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    await request(app.server).post('/users').send({
      name: 'Franklin Jorge',
      email: 'franklin-jorge.ca@example.com',
      password: '123456',
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'franklin-jorge.ca@example.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
