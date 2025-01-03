import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { GetUserProfileUseCase } from './get-user-profile'

let userRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(userRepository)
  })

  it('should be able to get user profile by id', async () => {
    const newUser = await userRepository.create({
      name: 'Franklin Jorge',
      email: 'franklin-jorge.ca@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({ userId: newUser.id })

    expect(user.name).toEqual('Franklin Jorge')
  })

  it('it should not be able to get a user profile with wrong id', async () => {
    await expect(async () => {
      await sut.execute({
        userId: 'not-exists-id',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
