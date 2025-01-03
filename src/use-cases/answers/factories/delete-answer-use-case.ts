import { PrismaAnswersRepository } from '@/repositories/prisma/prisma-answers-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { DeleteAnswerUseCase } from '../delete-answer'

export function makeDeleteAnswerUseCase() {
  const prismaAnswerRepository = new PrismaAnswersRepository()
  const prismaUsersRepository = new PrismaUsersRepository()
  const editAnswerUseCase = new DeleteAnswerUseCase(
    prismaAnswerRepository,
    prismaUsersRepository,
  )

  return editAnswerUseCase
}
