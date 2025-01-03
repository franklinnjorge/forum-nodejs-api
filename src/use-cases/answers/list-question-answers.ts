import { AnswersRepository } from '@/repositories/answer-repository'
import { Answer, Question } from '@prisma/client'

export interface ListQuestionAnswersUseCaseRequest {
  page: number
  limit: number
  questionId: string
}

export interface ListQuestionAnswersUseCaseResponse {
  total: number
  hasNextPage: boolean
  result: {
    question: Question
    answers: Answer[]
  }
}

export class ListAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    page,
    limit,
    questionId,
  }: ListQuestionAnswersUseCaseRequest): Promise<ListQuestionAnswersUseCaseResponse> {
    const { answers, total, question } =
      await this.answersRepository.findManyPaginatedByQuestionId(
        page,
        limit,
        questionId,
      )

    let hasNextPage = false

    if (total > page * limit) {
      hasNextPage = true
    }

    return {
      total,
      hasNextPage,
      result: {
        question,
        answers,
      },
    }
  }
}
