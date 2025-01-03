import { Answer, Prisma, PrismaClient, Question } from '@prisma/client'
import { AnswersRepository } from '../answer-repository'
import { PrismaAnswerMapper } from './mappers/answers-mapper'

const prisma = new PrismaClient()

export class PrismaAnswersRepository implements AnswersRepository {
  async findByAuthorId(authorId: string): Promise<Answer | null> {
    return prisma.answer.findFirst({
      where: { authorId },
    })
  }

  async findById(id: string): Promise<Answer | null> {
    return prisma.answer.findUnique({
      where: { id },
    })
  }

  async create(data: Prisma.AnswerUncheckedCreateInput): Promise<Answer> {
    return prisma.answer.create({
      data,
    })
  }

  async save(answer: Answer): Promise<Answer> {
    return prisma.answer.update({
      where: { id: answer.id },
      data: answer,
    })
  }

  async delete(answer: Answer): Promise<void> {
    await prisma.answer.delete({
      where: { id: answer.id },
    })
  }

  async findManyPaginatedByQuestionId(
    page: number,
    limit: number,
    questionId: string,
  ): Promise<{ question: Question; answers: Answer[]; total: number }> {
    const MAX_ITEMS_PER_PAGE = limit
    const [answers, total] = await Promise.all([
      prisma.answer.findMany({
        where: { questionId },
        take: MAX_ITEMS_PER_PAGE,
        skip: (page - 1) * MAX_ITEMS_PER_PAGE,
        include: {
          question: true,
        },
      }),
      prisma.answer.count(),
    ])

    return {
      question: answers[0]?.question || null,
      answers: answers.map(PrismaAnswerMapper.toDomain),
      total,
    }
  }
}
