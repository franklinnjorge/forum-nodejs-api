import { makeListAnswersUseCase } from '@/use-cases/answers/factories/list-answers-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function list(request: FastifyRequest, response: FastifyReply) {
  const listAnswersQuerySchema = z.object({
    limit: z.coerce.number().min(1).default(20),
    page: z.coerce.number().min(1).default(1),
  })

  const listAnswersParamsSchema = z.object({
    questionId: z.coerce.string(),
  })

  const { limit, page } = listAnswersQuerySchema.parse(request.query)
  const { questionId } = listAnswersParamsSchema.parse(request.params)

  const listAnswersUseCase = makeListAnswersUseCase()

  const result = await listAnswersUseCase.execute({
    limit,
    page,
    questionId,
  })

  return response.status(200).send(result)
}
