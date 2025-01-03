import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateAnswerUseCase } from './create-answer'
import { faker } from '@faker-js/faker'
import { InMemoryAnswersRepository } from '@/repositories/in-memory/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from '@/repositories/in-memory/in-memory-questions-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserRole } from '@prisma/client'

let answersRepository: InMemoryAnswersRepository
let usersRepository: InMemoryUsersRepository
let questionsRepository: InMemoryQuestionsRepository
let sut: CreateAnswerUseCase

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

describe('Create Answer Use Case', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    questionsRepository = new InMemoryQuestionsRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new CreateAnswerUseCase(answersRepository, questionsRepository)
  })

  it('should be able to create a answer', async () => {
    const userCreated = await createUser()
    const questionCreated = await createQuestion(userCreated.id)

    const { answer } = await sut.execute({
      content: faker.lorem.text(),
      authorId: userCreated.id,
      questionId: questionCreated.id,
    })

    expect(answersRepository.items[0].id).toEqual(answer.id)
    expect(answersRepository.items[0].authorId).toEqual(userCreated.id)
  })
})
