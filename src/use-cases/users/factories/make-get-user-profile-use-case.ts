import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUserProfileUseCase } from '../get-user-profile'

export function makeGetUserProfileUseCase() {
  const prismaRepository = new PrismaUsersRepository()
  const getUseProfileUseCase = new GetUserProfileUseCase(prismaRepository)

  return getUseProfileUseCase
}
