import { InMemoryQuestionsRepository } from '@/repositories/in-memory/in-memory-questions-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { NotAllowedError } from '../errors/not-allowed-error'
import { DeleteQuestionUseCase } from './delete-question'
import { UserRole } from '@prisma/client'

let questionsRepository: InMemoryQuestionsRepository
let usersRepository: InMemoryUsersRepository
let sut: DeleteQuestionUseCase

async function createUser(role?: UserRole) {
  return await usersRepository.create({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password_hash: await hash('123456', 6),
    role: role ? 'ADMINISTRATION' : 'USER',
  })
}

async function createQuestion(authorId: string) {
  return await questionsRepository.create({
    title: faker.lorem.text(),
    content: faker.lorem.text(),
    authorId,
  })
}

describe('Delete Question Use Case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new DeleteQuestionUseCase(questionsRepository, usersRepository)
  })

  it('should be able to delete question', async () => {
    const userCreated = await createUser(UserRole.USER)
    const questionCreated = await createQuestion(userCreated.id)

    await sut.execute({
      authorId: userCreated.id,
      questionId: questionCreated.id,
    })

    expect(questionsRepository.items).toHaveLength(0)
  })

  it('should be able a ADMINISTRATOR to delete question', async () => {
    const userCreated = await createUser(UserRole.USER)
    const questionCreated = await createQuestion(userCreated.id)
    const administrator = await createUser(UserRole.ADMINISTRATION)

    await sut.execute({
      authorId: administrator.id,
      questionId: questionCreated.id,
    })

    expect(questionsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete question if user is not the author', async () => {
    const userCreated = await createUser(UserRole.USER)
    const questionCreated = await createQuestion(userCreated.id)

    await expect(
      async () =>
        await sut.execute({
          authorId: 'user-not-exist',
          questionId: questionCreated.id,
        }),
    ).rejects.toBeInstanceOf(NotAllowedError)
  })
})
