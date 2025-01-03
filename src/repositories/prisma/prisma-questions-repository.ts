import { PrismaClient, Prisma, Question } from '@prisma/client'
import { QuestionsRepository } from '../questions-repository'
import { ListQuestions, PrismaQuestionMapper } from './mappers/question-mapper'

const prisma = new PrismaClient()

export class PrismaQuestionsRepository implements QuestionsRepository {
  async findByAuthorId(authorId: string): Promise<Question | null> {
    return prisma.question.findFirst({
      where: { authorId },
    })
  }

  async findById(id: string): Promise<Question | null> {
    return prisma.question.findUnique({
      where: { id },
    })
  }

  async create(data: Prisma.QuestionUncheckedCreateInput): Promise<Question> {
    return prisma.question.create({
      data,
    })
  }

  async save(question: Question): Promise<Question> {
    return prisma.question.update({
      where: { id: question.id },
      data: question,
    })
  }

  async delete(question: Question): Promise<void> {
    await prisma.question.delete({
      where: { id: question.id },
    })
  }

  async findManyPaginated(
    page: number,
    limit: number,
  ): Promise<{ questions: ListQuestions[]; total: number }> {
    const MAX_ITEMS_PER_PAGE = limit
    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        take: MAX_ITEMS_PER_PAGE,
        skip: (page - 1) * MAX_ITEMS_PER_PAGE,
      }),
      prisma.question.count(),
    ])

    return {
      questions: questions.map(PrismaQuestionMapper.toDomain),
      total,
    }
  }
}
