import { InMemoryQuestionsRepository } from '@/repositories/in-memory/in-memory-questions-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { EditQuestionUseCase } from './edit-question'
import { NotAllowedError } from '../errors/not-allowed-error'

let questionsRepository: InMemoryQuestionsRepository
let userRepository: InMemoryUserRepository
let sut: EditQuestionUseCase

describe('Edit Question Use Case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    userRepository = new InMemoryUserRepository()

    sut = new EditQuestionUseCase(questionsRepository, userRepository)
  })

  it('should be able to edit question', async () => {
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

    await sut.execute({
      authorId: userCreated.id,
      questionId: questionCreated.id,
      title: 'New Title',
      content: 'New Content',
    })

    expect(questionsRepository.items[0].title).toEqual('New Title')
  })

  it('should be able a ADMINISTRATOR to edit question', async () => {
    const administrator = await userRepository.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: 'ADMINISTRATION',
      password_hash: await hash('123456', 6),
    })

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

    await sut.execute({
      title: 'New Title',
      content: 'New Content',
      authorId: administrator.id,
      questionId: questionCreated.id,
    })

    expect(questionsRepository.items[0].title).toEqual('New Title')
  })

  it('should not be able to edit question if user is not the author', async () => {
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

    await expect(
      async () =>
        await sut.execute({
          authorId: 'user-not-exist',
          questionId: questionCreated.id,
          title: 'New Title',
          content: 'New Content',
        }),
    ).rejects.toBeInstanceOf(NotAllowedError)
  })
})
