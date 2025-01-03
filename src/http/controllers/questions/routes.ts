import { verifyJWT } from '@/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { create } from './create.controller'
import { list } from './list.controller'
import { getById } from './get-by-id.controller'
import { edit } from './edit.controller'
import { deleteQuestion } from './delete.controller'

export async function questionsRoutes(app: FastifyInstance) {
  app.get('/questions', list)
  app.get('/questions/:id', getById)
  app.post('/questions', { onRequest: [verifyJWT] }, create)
  app.put('/questions/:id', { onRequest: [verifyJWT] }, edit)
  app.delete('/questions/:id', { onRequest: [verifyJWT] }, deleteQuestion)
}
