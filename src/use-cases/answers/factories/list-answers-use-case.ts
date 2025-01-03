import { PrismaAnswersRepository } from '@/repositories/prisma/prisma-answers-repository'
import { ListAnswersUseCase } from '../list-question-answers'

export function makeListAnswersUseCase() {
  const prismaRepository = new PrismaAnswersRepository()
  const listAnswersUseCase = new ListAnswersUseCase(prismaRepository)

  return listAnswersUseCase
}
