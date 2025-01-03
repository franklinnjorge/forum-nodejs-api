import { Answer } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { AnswersRepository } from '@/repositories/answer-repository'

export interface GetAnswerByIdUseCaseRequest {
  id: string
}

export interface GetAnswerByIdUseCaseResponse {
  answer: Answer
}

export class GetAnswerByIdUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({ id }: GetAnswerByIdUseCaseRequest) {
    const answer = await this.answersRepository.findById(id)

    if (!answer) {
      throw new ResourceNotFoundError()
    }

    return {
      answer,
    }
  }
}
