import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { RegisterUseCase } from './register'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'Franklin Jorge',
      email: 'franklin-jorge.ca@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'Franklin Jorge',
      email: 'franklin-jorge.ca@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHasded = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHasded).toBe(true)
  })

  it('it should not be able register with same email twice', async () => {
    const email = 'franklin-jorge.ca@example.com'

    await sut.execute({
      name: 'Franklin Jorge',
      email,
      password: '123456',
    })

    await expect(async () => {
      await sut.execute({
        name: 'Franklin Jorge',
        email,
        password: '123456',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
