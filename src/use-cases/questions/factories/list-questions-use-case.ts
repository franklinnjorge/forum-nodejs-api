import { PrismaQuestionsRepository } from '@/repositories/prisma/prisma-questions-repository'
import { ListQuestionsUseCase } from '../list-questions'

export function makeListQuestionsUseCase() {
  const prismaRepository = new PrismaQuestionsRepository()
  const listQuestionsUseCase = new ListQuestionsUseCase(prismaRepository)

  return listQuestionsUseCase
}
