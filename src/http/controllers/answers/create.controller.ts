import { makeCreateAnswerUseCase } from '@/use-cases/answers/factories/create-answer-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, response: FastifyReply) {
  const createAnswerBodySchema = z.object({
    content: z.string(),
  })

  const createQueryParamsSchema = z.object({
    questionId: z.coerce.string(),
  })

  const { content } = createAnswerBodySchema.parse(request.body)
  const { questionId } = createQueryParamsSchema.parse(request.params)

  const userId = request.user.sub

  const createAnswerUseCase = makeCreateAnswerUseCase()

  await createAnswerUseCase.execute({
    content,
    authorId: userId,
    questionId,
  })

  return response.status(201).send()
}
