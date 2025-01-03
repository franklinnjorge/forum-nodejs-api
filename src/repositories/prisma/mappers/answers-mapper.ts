import { Answer } from '@prisma/client'

export class PrismaAnswerMapper {
  static toDomain(answer: Answer): Answer {
    return {
      id: answer.id,
      content: answer.content,
      questionId: answer.questionId,
      authorId: answer.authorId,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    }
  }
}
