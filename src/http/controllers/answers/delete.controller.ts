import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeDeleteAnswerUseCase } from '@/use-cases/answers/factories/delete-answer-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteAnswer(
  request: FastifyRequest,
  response: FastifyReply,
) {
  try {
    const deleteAnswerParamsSchema = z.object({
      id: z.coerce.string(),
    })

    const authorId = request.user.sub
    const { id } = deleteAnswerParamsSchema.parse(request.params)

    const deleteAnswer = makeDeleteAnswerUseCase()

    const result = await deleteAnswer.execute({
      authorId,
      answerId: id,
    })

    return response.status(200).send(result)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return response.status(404).send({ message: error.message })
    }
    return response.status(500).send(error)
  }
}
