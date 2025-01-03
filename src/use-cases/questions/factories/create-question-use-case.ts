import { PrismaQuestionsRepository } from '@/repositories/prisma/prisma-questions-repository'
import { CreateQuestionUseCase } from '../create-question'

export function makeCreateQuestionUseCase() {
  const prismaRepository = new PrismaQuestionsRepository()
  const createQuestionUseCase = new CreateQuestionUseCase(prismaRepository)

  return createQuestionUseCase
}
