import { InMemoryAnswersRepository } from '@/repositories/in-memory/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from '@/repositories/in-memory/in-memory-questions-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { faker } from '@faker-js/faker'
import { UserRole } from '@prisma/client'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { NotAllowedError } from '../errors/not-allowed-error'
import { EditAnswerUseCase } from './edit-answer'

let answersRepository: InMemoryAnswersRepository
let usersRepository: InMemoryUsersRepository
let questionsRepository: InMemoryQuestionsRepository
let sut: EditAnswerUseCase

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

describe('Edit Answer Use Case', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    questionsRepository = new InMemoryQuestionsRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new EditAnswerUseCase(answersRepository, usersRepository)
  })

  it('should be able to edit answer', async () => {
    const userCreated = await createUser(UserRole.USER)
    const question = await createQuestion(userCreated.id)
    const answerCreated = await createAnswer(userCreated.id, question.id)

    await sut.execute({
      authorId: userCreated.id,
      answerId: answerCreated.id,
      content: 'New Content',
    })

    expect(answersRepository.items[0].authorId).toEqual(userCreated.id)
    expect(answersRepository.items[0].content).toEqual('New Content')
  })

  it('should be able a ADMINISTRATOR to edit answer', async () => {
    const userCreated = await createUser(UserRole.USER)
    const administrator = await createUser(UserRole.ADMINISTRATION)
    const question = await createQuestion(userCreated.id)
    const answerCreated = await createAnswer(userCreated.id, question.id)

    await sut.execute({
      content: 'New Content',
      authorId: administrator.id,
      answerId: answerCreated.id,
    })

    expect(answersRepository.items[0].authorId).toEqual(userCreated.id)
    expect(answersRepository.items[0].content).toEqual('New Content')
  })

  it('should not be able to edit answer if user is not the author', async () => {
    const userCreated = await createUser(UserRole.USER)
    const question = await createQuestion(userCreated.id)
    const answerCreated = await createAnswer(userCreated.id, question.id)

    await expect(
      async () =>
        await sut.execute({
          authorId: 'user-not-exist',
          answerId: answerCreated.id,
          content: 'New Content',
        }),
    ).rejects.toBeInstanceOf(NotAllowedError)
  })
})
