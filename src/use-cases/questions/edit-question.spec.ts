import { InMemoryQuestionsRepository } from '@/repositories/in-memory/in-memory-questions-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { EditQuestionUseCase } from './edit-question'
import { NotAllowedError } from '../errors/not-allowed-error'
import { UserRole } from '@prisma/client'

let questionsRepository: InMemoryQuestionsRepository
let usersRepository: InMemoryUsersRepository
let sut: EditQuestionUseCase

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

describe('Edit Question Use Case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new EditQuestionUseCase(questionsRepository, usersRepository)
  })

  it('should be able to edit question', async () => {
    const userCreated = await createUser(UserRole.USER)
    const questionCreated = await createQuestion(userCreated.id)

    await sut.execute({
      authorId: userCreated.id,
      questionId: questionCreated.id,
      title: 'New Title',
      content: 'New Content',
    })

    expect(questionsRepository.items[0].title).toEqual('New Title')
  })

  it('should be able a ADMINISTRATOR to edit question', async () => {
    const userCreated = await createUser(UserRole.USER)
    const administrator = await createUser(UserRole.ADMINISTRATION)
    const questionCreated = await createQuestion(userCreated.id)

    await sut.execute({
      title: 'New Title',
      content: 'New Content',
      authorId: administrator.id,
      questionId: questionCreated.id,
    })

    expect(questionsRepository.items[0].title).toEqual('New Title')
  })

  it('should not be able to edit question if user is not the author', async () => {
    const userCreated = await createUser(UserRole.USER)
    const questionCreated = await createQuestion(userCreated.id)

    await expect(
      async () =>
        await sut.execute({
          authorId: 'user-not-exist',
          questionId: questionCreated.id,
          title: 'New Title',
          content: 'New Content',
        }),
    ).rejects.toBeInstanceOf(NotAllowedError)
  })
})
