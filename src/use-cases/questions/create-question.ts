import { QuestionsRepository } from '@/repositories/questions-repository'
import { Question } from '@prisma/client'

export interface CreateQuestionUseCaseRequest {
  title: string
  content: string
  authorId: string
}

export interface RegisterUseCaseResponse {
  question: Question
}

export class CreateQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ title, content, authorId }: CreateQuestionUseCaseRequest) {
    const question = await this.questionsRepository.create({
      title,
      content,
      authorId,
    })

    return {
      question,
    }
  }
}
