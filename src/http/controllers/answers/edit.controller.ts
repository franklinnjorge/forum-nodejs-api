import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeEditAnswerUseCase } from '@/use-cases/answers/factories/edit-answer-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function edit(request: FastifyRequest, response: FastifyReply) {
  try {
    const editAnswerByIdBodySchema = z.object({
      content: z.coerce.string(),
    })

    const editAnswerByIdParamsSchema = z.object({
      id: z.coerce.string(),
    })

    const authorId = request.user.sub
    const { content } = editAnswerByIdBodySchema.parse(request.body)
    const { id } = editAnswerByIdParamsSchema.parse(request.params)

    const editAnswer = makeEditAnswerUseCase()

    const result = await editAnswer.execute({
      content,
      authorId,
      answerId: id,
    })

    return response.status(202).send(result)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return response.status(404).send({ message: error.message })
    }
    return response.status(500).send(error)
  }
}
