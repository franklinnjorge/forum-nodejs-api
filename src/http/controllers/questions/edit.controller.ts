import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeEditQuestionUseCase } from '@/use-cases/questions/factories/edit-question-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function edit(request: FastifyRequest, response: FastifyReply) {
  try {
    const editQuestionByIdBodySchema = z.object({
      title: z.coerce.string(),
      content: z.coerce.string(),
    })

    const editQuestionByIdParamsSchema = z.object({
      id: z.coerce.string(),
    })

    const authorId = request.user.sub
    const { title, content } = editQuestionByIdBodySchema.parse(request.body)
    const { id } = editQuestionByIdParamsSchema.parse(request.params)

    const editQuestion = makeEditQuestionUseCase()

    const result = await editQuestion.execute({
      title,
      content,
      authorId,
      questionId: id,
    })

    return response.status(202).send(result)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return response.status(404).send({ message: error.message })
    }
    return response.status(500).send(error)
  }
}
