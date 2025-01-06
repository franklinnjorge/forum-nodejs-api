import { verifyJWT } from '@/middlewares/verify-jwt'
import {
  authenticateSchema,
  createSchema,
  profileSchema,
  updateProfileAvatarSchema,
} from '@/schema/users.schema'
import { FastifyInstance } from 'fastify'
import { authenticate } from './authenticate.controller'
import { profile } from './profile.controller'
import { refresh } from './refresh.controller'
import { register } from './register.controller'
import { updateProfileAvatar } from './update-profile-avatar.controller'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', { schema: createSchema }, register)
  app.post('/sessions', { schema: authenticateSchema }, authenticate)
  app.get(
    '/profile',
    { onRequest: [verifyJWT], schema: profileSchema },
    profile,
  )
  app.post(
    '/profile/avatar',
    { onRequest: [verifyJWT], schema: updateProfileAvatarSchema },
    updateProfileAvatar,
  )
  app.patch('/token/refresh', { onRequest: [verifyJWT] }, refresh)
}
