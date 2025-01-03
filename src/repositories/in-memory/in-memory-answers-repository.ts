import { Answer, Prisma, Question } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { AnswersRepository } from '../answer-repository'
import { InMemoryQuestionsRepository } from './in-memory-questions-repository'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  async findByAuthorId(authorId: string) {
    const answer = this.items.find((item) => item.authorId === authorId) || null
    return answer
  }

  findById(id: string): Promise<Answer | null> {
    const answer = this.items.find((item) => item.id === id) || null
    return Promise.resolve(answer)
  }

  async create(data: Prisma.AnswerUncheckedCreateInput): Promise<Answer> {
    const newAnswer: Answer = {
      id: randomUUID(),
      ...data,
    } as Answer
    this.items.push(newAnswer)
    return newAnswer
  }

  async save(answer: Answer): Promise<Answer> {
    const index = this.items.findIndex((item) => item.id === answer.id)
    this.items[index] = answer
    return answer
  }

  async delete(answer: Answer): Promise<void> {
    const findIndex = this.items.findIndex((items) => items.id === answer.id)
    this.items.splice(findIndex, 1)
  }

  async findManyPaginatedByQuestionId(
    page: number,
    limit: number,
    questionId: string,
  ): Promise<{ question: Question; answers: Answer[]; total: number }> {
    const question = (await new InMemoryQuestionsRepository().findById(
      questionId,
    )) as Question

    const start = (page - 1) * limit
    const end = start + limit
    const paginatedItems = this.items.slice(start, end)

    return {
      question,
      answers: paginatedItems,
      total: this.items.length,
    }
  }
}
