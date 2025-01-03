import { PrismaQuestionsRepository } from '@/repositories/prisma/prisma-questions-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { DeleteQuestionUseCase } from '../delete-question'

export function makeDeleteQuestionUseCase() {
  const prismaQuestionRepository = new PrismaQuestionsRepository()
  const prismaUsersRepository = new PrismaUsersRepository()
  const editQuestionUseCase = new DeleteQuestionUseCase(
    prismaQuestionRepository,
    prismaUsersRepository,
  )

  return editQuestionUseCase
}
