import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAnswer(
  app: FastifyInstance,
  questionId: string,
  token: string,
) {
  await request(app.server)
    .post(`/answers/${questionId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      content: 'Content of the answer',
    })

  const allAnswers = await request(app.server).get(`/answers/${questionId}`)
  const answer = allAnswers.body.result.answers[0]

  return {
    answer,
    token,
  }
}
