import { app } from '@/app'
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

describe('Register - (e2e)', () => {
  beforeEach(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to register a new user', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'Franklin Jorge',
      email: 'franklin-jorge.ca@example.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
  })
})
