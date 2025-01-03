import { InMemoryQuestionsRepository } from '@/repositories/in-memory/in-memory-questions-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { GetQuestionByIdUseCase } from './get-question-by-id'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { faker } from '@faker-js/faker'

let questionsRepository: InMemoryQuestionsRepository
let userRepository: InMemoryUserRepository
let sut: GetQuestionByIdUseCase

describe('Get Question By Id Use Case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    userRepository = new InMemoryUserRepository()

    sut = new GetQuestionByIdUseCase(questionsRepository)
  })

  it('should be able to get a question by id', async () => {
    const userCreated = await userRepository.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password_hash: await hash('123456', 6),
    })

    const questionCreated = await questionsRepository.create({
      title: faker.lorem.text(),
      content: faker.lorem.text(),
      authorId: userCreated.id,
    })

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
