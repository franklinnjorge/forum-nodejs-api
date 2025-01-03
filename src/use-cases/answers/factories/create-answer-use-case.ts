import { PrismaAnswersRepository } from '@/repositories/prisma/prisma-answers-repository'
import { CreateAnswerUseCase } from '../create-answer'
import { PrismaQuestionsRepository } from '@/repositories/prisma/prisma-questions-repository'

export function makeCreateAnswerUseCase() {
  const prismaAnswerRepository = new PrismaAnswersRepository()
  const prismaQuestionRepository = new PrismaQuestionsRepository()
  const createAnswerUseCase = new CreateAnswerUseCase(
    prismaAnswerRepository,
    prismaQuestionRepository,
  )

  return createAnswerUseCase
}
