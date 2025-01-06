import { makeCreateQuestionUseCase } from '@/use-cases/questions/factories/create-question-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, response: FastifyReply) {
  try {
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return response.status(400).send({ message: error.errors[0].message })
    }
    throw response.status(500).send(error)
  }
}
