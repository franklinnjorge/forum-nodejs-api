import { QuestionsRepository } from '@/repositories/questions-repository'
import { Question } from '@prisma/client'

export interface ListQuestionsUseCaseRequest {
  page: number
  limit: number
}

export interface ListQuestionsUseCaseResponse {
  questions: Question
  total: number
  hasNextPage: boolean
}

export class ListQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ page, limit }: ListQuestionsUseCaseRequest) {
    const { questions, total } =
      await this.questionsRepository.findManyPaginated(page, limit)

    let hasNextPage = false

    if (total > page * limit) {
      hasNextPage = true
    }

    return {
      total,
      hasNextPage,
      questions,
    }
  }
}
