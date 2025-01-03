import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeGetQuestionByIdUseCase } from '@/use-cases/questions/factories/get-question-by-id-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getById(request: FastifyRequest, response: FastifyReply) {
  try {
    const getQuestionByIdParamsSchema = z.object({
      id: z.coerce.string(),
    })

    const { id } = getQuestionByIdParamsSchema.parse(request.params)

    const getQuestionById = makeGetQuestionByIdUseCase()

    const result = await getQuestionById.execute({
      id,
    })

    return response.status(200).send(result)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return response.status(404).send({ message: error.message })
    }
    return response.status(500).send(error)
  }
}
