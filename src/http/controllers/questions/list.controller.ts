import { makeListQuestionsUseCase } from '@/use-cases/questions/factories/list-questions-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function list(request: FastifyRequest, response: FastifyReply) {
  const listQuestionsQuerySchema = z.object({
    limit: z.coerce.number().min(1).default(20),
    page: z.coerce.number().min(1).default(1),
  })

  const { limit, page } = listQuestionsQuerySchema.parse(request.query)

  const listQuestionsUseCase = makeListQuestionsUseCase()

  const result = await listQuestionsUseCase.execute({
    limit,
    page,
  })

  return response.status(200).send(result)
}
