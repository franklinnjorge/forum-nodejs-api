import { makeCreateQuestionUseCase } from '@/use-cases/questions/factories/create-question-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, response: FastifyReply) {
  const createQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string(),
  })

  const { title, content } = createQuestionBodySchema.parse(request.body)
  const userId = request.user.sub

  const createQuestionUseCase = makeCreateQuestionUseCase()

  await createQuestionUseCase.execute({
    title,
    content,
    authorId: userId,
  })

  return response.status(201).send()
}
