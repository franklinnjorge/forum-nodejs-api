import { InMemoryAnswersRepository } from '@/repositories/in-memory/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from '@/repositories/in-memory/in-memory-questions-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { faker } from '@faker-js/faker'
import { UserRole } from '@prisma/client'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { GetAnswerByIdUseCase } from './get-answer-by-id'

let answersRepository: InMemoryAnswersRepository
let usersRepository: InMemoryUsersRepository
let questionsRepository: InMemoryQuestionsRepository
let sut: GetAnswerByIdUseCase

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

describe('Get Answer By Id Use Case', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    usersRepository = new InMemoryUsersRepository()
    questionsRepository = new InMemoryQuestionsRepository()

    sut = new GetAnswerByIdUseCase(answersRepository)
  })

  it('should be able to get a answer by id', async () => {
    const userCreated = await createUser(UserRole.USER)
    const question = await createQuestion(userCreated.id)
    const answerCreated = await createAnswer(userCreated.id, question.id)

    const { answer } = await sut.execute({ id: answerCreated.id })

    expect(answer.id).toEqual(answerCreated.id)
  })

  it('it should not be able to get a answer with wrong id', async () => {
    await expect(async () => {
      await sut.execute({
        id: 'not-exists-id',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
