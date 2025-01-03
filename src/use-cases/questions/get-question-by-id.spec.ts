import { InMemoryQuestionsRepository } from '@/repositories/in-memory/in-memory-questions-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { GetQuestionByIdUseCase } from './get-question-by-id'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { faker } from '@faker-js/faker'
import { UserRole } from '@prisma/client'

let questionsRepository: InMemoryQuestionsRepository
let usersRepository: InMemoryUsersRepository
let sut: GetQuestionByIdUseCase

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

describe('Get Question By Id Use Case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new GetQuestionByIdUseCase(questionsRepository)
  })

  it('should be able to get a question by id', async () => {
    const userCreated = await createUser(UserRole.USER)
    const questionCreated = await createQuestion(userCreated.id)

    const { question } = await sut.execute({ id: questionCreated.id })

    expect(question.title).toEqual(questionCreated.title)
  })

  it('it should not be able to get a question with wrong id', async () => {
    await expect(async () => {
      await sut.execute({
        id: 'not-exists-id',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
