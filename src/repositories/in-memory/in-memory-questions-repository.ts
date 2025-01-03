import { Prisma, Question } from '@prisma/client'
import {
  ListQuestions,
  PrismaQuestionMapper,
} from '../prisma/mappers/question-mapper'
import { QuestionsRepository } from '../questions-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  async findByAuthorId(authorId: string): Promise<Question | null> {
    const question =
      this.items.find((item) => item.authorId === authorId) || null
    return question
  }

  findById(id: string): Promise<Question | null> {
    const question = this.items.find((item) => item.id === id) || null
    return Promise.resolve(question)
  }

  async create(data: Prisma.QuestionUncheckedCreateInput): Promise<Question> {
    const newQuestion: Question = {
      id: randomUUID(),
      ...data,
    } as Question
    this.items.push(newQuestion)
    return newQuestion
  }

  async save(question: Question): Promise<Question> {
    const index = this.items.findIndex((item) => item.id === question.id)
    this.items[index] = question
    return question
  }

  async delete(question: Question): Promise<void> {
    const findIndex = this.items.findIndex((items) => items.id === question.id)
    this.items.splice(findIndex, 1)
  }

  async findManyPaginated(
    page: number,
    limit: number,
  ): Promise<{ questions: ListQuestions[]; total: number }> {
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedItems = this.items.slice(start, end)

    const mappedQuestions = paginatedItems.map(PrismaQuestionMapper.toDomain)

    return {
      questions: mappedQuestions,
      total: this.items.length,
    }
  }
}
