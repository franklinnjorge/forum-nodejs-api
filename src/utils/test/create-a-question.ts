import prisma from '@/prisma'
import { FastifyInstance } from 'fastify'
import { createAndAuthenticateUser } from './create-and-authenticate-user'
import request from 'supertest'

export async function createQuestion(app: FastifyInstance, isAdmin = false) {
  const { token } = await createAndAuthenticateUser(app, isAdmin)

  const response = await request(app.server)
    .get('/profile')
    .set('Authorization', `Bearer ${token}`)

  const { id } = response.body.user

  const question = await prisma.question.create({
    data: {
      title: 'Title of the question',
      content: 'Content of the question',
      authorId: id,
    },
  })

  return {
    question,
    token,
  }
}
