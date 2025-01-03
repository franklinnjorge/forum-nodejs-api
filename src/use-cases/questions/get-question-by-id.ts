import { QuestionsRepository } from '@/repositories/questions-repository'
import { Question } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

export interface GetQuestionByIdUseCaseRequest {
  id: string
}

export interface GetQuestionByIdUseCaseResponse {
  question: Question
}

export class GetQuestionByIdUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ id }: GetQuestionByIdUseCaseRequest) {
    const question = await this.questionsRepository.findById(id)

    if (!question) {
      throw new ResourceNotFoundError()
    }

    return {
      question,
    }
  }
}
