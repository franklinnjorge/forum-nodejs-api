import { PrismaAnswersRepository } from '@/repositories/prisma/prisma-answers-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { EditAnswerUseCase } from '../edit-answer'

export function makeEditAnswerUseCase() {
  const prismaAnswerRepository = new PrismaAnswersRepository()
  const prismaUsersRepository = new PrismaUsersRepository()
  const editAnswerUseCase = new EditAnswerUseCase(
    prismaAnswerRepository,
    prismaUsersRepository,
  )

  return editAnswerUseCase
}
