import { InMemoryQuestionsRepository } from '@/repositories/in-memory/in-memory-questions-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateQuestionUseCase } from './create-question'
import { faker } from '@faker-js/faker'

let questionsRepository: InMemoryQuestionsRepository
let userRepository: InMemoryUserRepository
let sut: CreateQuestionUseCase

describe('Create Question Use Case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    userRepository = new InMemoryUserRepository()

    sut = new CreateQuestionUseCase(questionsRepository)
  })

  it('should be able to get a question by id', async () => {
    const userCreated = await userRepository.create({
      name: 'Franklin Jorge',
      email: 'franklin-jorge.ca@example.com',
      password_hash: await hash('123456', 6),
    })

    const { question } = await sut.execute({
      title: faker.lorem.text(),
      content: faker.lorem.text(),
      authorId: userCreated.id,
    })

    expect(question.title).toEqual(expect.any(String))
  })
})
