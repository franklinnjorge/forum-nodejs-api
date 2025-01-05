import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UpdateProfileAvatarUseCase } from '../update-profile-avatar'

export function makeUpdateProfileAvatarUseCase() {
  const prismaRepository = new PrismaUsersRepository()
  const profileAvatarUseCase = new UpdateProfileAvatarUseCase(prismaRepository)

  return profileAvatarUseCase
}
