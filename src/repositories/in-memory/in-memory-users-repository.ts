import { Prisma, User, UserRole } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findById(id: string) {
    const user = this.items.find((user) => user.id === id)

    if (!user) {
      return null
    }

    return user || null
  }

  async findByEmail(email: string) {
    const user = this.items.find((user) => user.email === email)

    if (!user) {
      return null
    }

    return user || null
  }

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      role: data.role || UserRole.USER,
      avatarKey: data.avatarKey || null,
      createdAt: new Date(),
      updatedAt: null,
    }

    this.items.push(user)
    return user
  }

  async updateProfileAvatar(
    data: Prisma.UserUpdateInput,
  ): Promise<User | null> {
    const userIndex = this.items.findIndex((user) => user.id === data.id)

    if (userIndex === -1) {
      return null
    }

    let avatarKey: string | null = null
    if (typeof data.avatarKey === 'string' || data.avatarKey === null) {
      avatarKey = data.avatarKey
    } else if (data.avatarKey && typeof data.avatarKey.set === 'string') {
      avatarKey = data.avatarKey.set
    }

    this.items[userIndex] = {
      ...this.items[userIndex],
      avatarKey,
      updatedAt: new Date(),
    }

    return this.items[userIndex]
  }
}
