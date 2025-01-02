import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

describe('Profile - (e2e)', () => {
  beforeEach(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to get a profile', async () => {
    const { token } = await createAndAuthenticateUser(app, false)

    const response = await request(app.server)
      .get('/profile')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.user).toEqual(
      expect.objectContaining({
        email: 'franklin-jorge.ca@example.com',
      }),
    )
  })
})
