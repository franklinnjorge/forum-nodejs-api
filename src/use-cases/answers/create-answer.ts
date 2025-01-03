import { AnswersRepository } from '@/repositories/answer-repository'
import { QuestionsRepository } from '@/repositories/questions-repository'
import { Answer } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

export interface CreateAnswerUseCaseRequest {
  content: string
  authorId: string
  questionId: string
}

export interface AnswerUseCaseResponse {
  answer: Answer
}

export class CreateAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private questionRepository: QuestionsRepository,
  ) {}

  async execute({
    content,
    authorId,
    questionId,
  }: CreateAnswerUseCaseRequest): Promise<AnswerUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      throw new ResourceNotFoundError()
    }

    const answer = await this.answersRepository.create({
      content,
      authorId,
      questionId,
    })

    return {
      answer,
    }
  }
}
