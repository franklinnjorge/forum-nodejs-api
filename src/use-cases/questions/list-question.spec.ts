import { InMemoryQuestionsRepository } from '@/repositories/in-memory/in-memory-questions-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { ListQuestionsUseCase } from './list-questions'
import { faker } from '@faker-js/faker'
import { UserRole } from '@prisma/client'

let questionsRepository: InMemoryQuestionsRepository
let usersRepository: InMemoryUsersRepository
let sut: ListQuestionsUseCase

async function createUser(role?: UserRole) {
  return await usersRepository.create({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password_hash: await hash('123456', 6),
    role: role ? 'ADMINISTRATION' : 'USER',
  })
}

async function createQuestion(authorId: string, quantity: number) {
  for (let i = 0; i < quantity; i++) {
    await questionsRepository.create({
      title: faker.lorem.text(),
      content: faker.lorem.text(),
      authorId,
    })
  }
}

describe('List Question Use Case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new ListQuestionsUseCase(questionsRepository)
  })

  it('should be able to list questions', async () => {
    const userCreated = await createUser(UserRole.USER)
    await createQuestion(userCreated.id, 5)

    const { results } = await sut.execute({ limit: 10, page: 1 })

    expect(results.questions).toHaveLength(5)
  })
})
