import { PrismaAnswersRepository } from '@/repositories/prisma/prisma-answers-repository'
import { GetAnswerByIdUseCase } from '../get-answer-by-id'

export function makeGetAnswerByIdUseCase() {
  const prismaRepository = new PrismaAnswersRepository()
  const getAnswerByIdUseCase = new GetAnswerByIdUseCase(prismaRepository)

  return getAnswerByIdUseCase
}
