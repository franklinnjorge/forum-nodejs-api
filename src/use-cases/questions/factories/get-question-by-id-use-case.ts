import { PrismaQuestionsRepository } from '@/repositories/prisma/prisma-questions-repository'
import { GetQuestionByIdUseCase } from '../get-question-by-id'

export function makeGetQuestionByIdUseCase() {
  const prismaRepository = new PrismaQuestionsRepository()
  const getQuestionByIdUseCase = new GetQuestionByIdUseCase(prismaRepository)

  return getQuestionByIdUseCase
}
