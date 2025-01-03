import { InMemoryQuestionsRepository } from '@/repositories/in-memory/in-memory-questions-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { ListQuestionsUseCase } from './list-questions'
import { faker } from '@faker-js/faker'

let questionsRepository: InMemoryQuestionsRepository
let userRepository: InMemoryUserRepository
let sut: ListQuestionsUseCase

describe('List Question Use Case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    userRepository = new InMemoryUserRepository()

    sut = new ListQuestionsUseCase(questionsRepository)
  })

  it('should be able to list questions', async () => {
    const userCreated = await userRepository.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password_hash: await hash('123456', 6),
    })

    await questionsRepository.create({
      title: faker.lorem.text(),
      content: faker.lorem.text(),
      authorId: userCreated.id,
    })

    await questionsRepository.create({
      title: faker.lorem.text(),
      content: faker.lorem.text(),
      authorId: userCreated.id,
    })

    const { questions } = await sut.execute({ limit: 10, page: 1 })

    expect(questions).toHaveLength(2)
  })
})
