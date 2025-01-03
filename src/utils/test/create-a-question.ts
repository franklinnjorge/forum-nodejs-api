import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createQuestion(app: FastifyInstance, token: string) {
  const response = await request(app.server)
    .get('/profile')
    .set('Authorization', `Bearer ${token}`)

  const { id } = response.body.user

  await request(app.server)
    .post('/questions')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Title of the question',
      content: 'Content of the question',
      authorId: id,
    })

  const allQuestions = await request(app.server).get('/questions')
  const question = allQuestions.body.results.questions[0]

  return {
    question,
  }
}
