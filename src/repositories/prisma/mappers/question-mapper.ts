import { Question } from '@prisma/client'

export interface ListQuestions {
  id: string
  title: string
  contentSnippet: string
  createdAt: Date
  updatedAt: Date | null
}

export class PrismaQuestionMapper {
  static toDomain(question: Question): ListQuestions {
    return {
      id: question.id,
      title: question.title,
      contentSnippet: `${question.content.slice(0, 50)}...`,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
