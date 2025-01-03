import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeDeleteQuestionUseCase } from '@/use-cases/questions/factories/delete-question-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteQuestion(
  request: FastifyRequest,
  response: FastifyReply,
) {
  try {
    const deleteQuestionParamsSchema = z.object({
      id: z.coerce.string(),
    })

    const authorId = request.user.sub
    const { id } = deleteQuestionParamsSchema.parse(request.params)

    const deleteQuestion = makeDeleteQuestionUseCase()

    const result = await deleteQuestion.execute({
      authorId,
      questionId: id,
    })

    return response.status(200).send(result)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return response.status(404).send({ message: error.message })
    }
    return response.status(500).send(error)
  }
}
