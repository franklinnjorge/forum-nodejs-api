import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeGetAnswerByIdUseCase } from '@/use-cases/answers/factories/get-answer-by-id-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getById(request: FastifyRequest, response: FastifyReply) {
  try {
    const getAnswerByIdParamsSchema = z.object({
      id: z.coerce.string(),
    })

    const { id } = getAnswerByIdParamsSchema.parse(request.params)

    const getAnswerById = makeGetAnswerByIdUseCase()

    const result = await getAnswerById.execute({
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
