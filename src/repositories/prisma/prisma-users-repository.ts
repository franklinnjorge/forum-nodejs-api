import { Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'
import prisma from '@/prisma'

export class PrismaUsersRepository implements UsersRepository {
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    return user
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    })

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const newUser = await prisma.user.create({
      data,
    })

    return newUser
  }
}
