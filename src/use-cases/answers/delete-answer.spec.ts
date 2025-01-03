import { InMemoryAnswersRepository } from '@/repositories/in-memory/in-memory-answers-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { NotAllowedError } from '../errors/not-allowed-error'
import { DeleteAnswerUseCase } from './delete-answer'
import { InMemoryQuestionsRepository } from '@/repositories/in-memory/in-memory-questions-repository'
import { UserRole } from '@prisma/client'

let answersRepository: InMemoryAnswersRepository
let questionsRepository: InMemoryQuestionsRepository
let usersRepository: InMemoryUsersRepository
let sut: DeleteAnswerUseCase

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

async function createAnswer(authorId: string, questionId: string) {
  return await answersRepository.create({
    content: faker.lorem.text(),
    authorId,
    questionId,
  })
}

describe('Delete Answer Use Case', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    questionsRepository = new InMemoryQuestionsRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new DeleteAnswerUseCase(answersRepository, usersRepository)
  })

  it('should be able to delete answer', async () => {
    const userCreated = await createUser(UserRole.USER)
    const questionCreated = await createQuestion(userCreated.id)
    const answerCreated = await createAnswer(userCreated.id, questionCreated.id)

    await sut.execute({
      authorId: userCreated.id,
      answerId: answerCreated.id,
    })

    expect(answersRepository.items).toHaveLength(0)
  })

  it('should be able a ADMINISTRATOR to delete answer', async () => {
    const userCreated = await createUser(UserRole.USER)
    const administrator = await createUser(UserRole.ADMINISTRATION)
    const questionCreated = await createQuestion(userCreated.id)
    const answerCreated = await createAnswer(userCreated.id, questionCreated.id)

    await sut.execute({
      authorId: administrator.id,
      answerId: answerCreated.id,
    })

    expect(answersRepository.items).toHaveLength(0)
  })

  it('should not be able to delete answer if user is not the author', async () => {
    const userCreated = await createUser(UserRole.USER)
    const questionCreated = await createQuestion(userCreated.id)
    const answerCreated = await createAnswer(userCreated.id, questionCreated.id)

    await expect(
      async () =>
        await sut.execute({
          authorId: 'user-not-exist',
          answerId: answerCreated.id,
        }),
    ).rejects.toBeInstanceOf(NotAllowedError)
  })
})
