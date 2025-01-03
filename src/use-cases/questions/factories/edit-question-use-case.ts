import { PrismaQuestionsRepository } from '@/repositories/prisma/prisma-questions-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { EditQuestionUseCase } from '../edit-question'

export function makeEditQuestionUseCase() {
  const prismaQuestionRepository = new PrismaQuestionsRepository()
  const prismaUsersRepository = new PrismaUsersRepository()
  const editQuestionUseCase = new EditQuestionUseCase(
    prismaQuestionRepository,
    prismaUsersRepository,
  )

  return editQuestionUseCase
}
