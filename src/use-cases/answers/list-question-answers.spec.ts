import { InMemoryAnswersRepository } from '@/repositories/in-memory/in-memory-answers-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { ListAnswersUseCase } from './list-question-answers'
import { faker } from '@faker-js/faker'
import { UserRole } from '@prisma/client'
import { InMemoryQuestionsRepository } from '@/repositories/in-memory/in-memory-questions-repository'

let answersRepository: InMemoryAnswersRepository
let questionsRepository: InMemoryQuestionsRepository
let usersRepository: InMemoryUsersRepository
let sut: ListAnswersUseCase

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

async function createAnswer(
  authorId: string,
  questionId: string,
  quantity: number,
) {
  for (let i = 0; i < quantity; i++) {
    await answersRepository.create({
      content: faker.lorem.text(),
      authorId,
      questionId,
    })
  }
}

describe('List Answers by question Id Use Case', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    questionsRepository = new InMemoryQuestionsRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new ListAnswersUseCase(answersRepository)
  })

  it('should be able to list answers', async () => {
    const userCreated = await createUser(UserRole.USER)
    const question = await createQuestion(userCreated.id)
    await createAnswer(userCreated.id, question.id, 3)

    const { result } = await sut.execute({
      limit: 10,
      page: 1,
      questionId: question.id,
    })

    expect(result.answers).toHaveLength(3)
  })
})
