import { FastifyInstance } from 'fastify'
import { register } from './register.controller'
import { authenticate } from './authenticate.controller'
import { profile } from './profile.controller'
import { verifyJWT } from '@/middlewares/verify-jwt'
import { updateProfileAvatar } from './update-profile-avatar.controller'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)
  app.get('/profile', { onRequest: [verifyJWT] }, profile)
  app.post('/profile/avatar', { onRequest: [verifyJWT] }, updateProfileAvatar)
}
