import { verifyJWT } from '@/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { create } from './create.controller'
import { list } from './list.controller'
import { getById } from './get-by-id.controller'
import { edit } from './edit.controller'
import { deleteAnswer } from './delete.controller'

export async function answersRoutes(app: FastifyInstance) {
  app.get('/answer/:id', getById)
  app.get('/answers/:questionId', list)
  app.post('/answers/:questionId', { onRequest: [verifyJWT] }, create)
  app.put('/answers/:id', { onRequest: [verifyJWT] }, edit)
  app.delete('/answers/:id', { onRequest: [verifyJWT] }, deleteAnswer)
}
