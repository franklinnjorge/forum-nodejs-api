import { QuestionsRepository } from '@/repositories/questions-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { NotAllowedError } from '../errors/not-allowed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

export interface DeleteQuestionUseCaseRequest {
  authorId: string
  questionId: string
}

export type DeleteQuestionUseCaseResponse =
  | ResourceNotFoundError
  | NotAllowedError

export class DeleteQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({ authorId, questionId }: DeleteQuestionUseCaseRequest) {
    const question = await this.questionsRepository.findById(questionId)
    const user = await this.usersRepository.findById(authorId)

    if (!question) {
      throw new ResourceNotFoundError()
    }

    if (authorId !== question.authorId && user?.role !== 'ADMINISTRATION') {
      throw new NotAllowedError()
    }

    await this.questionsRepository.delete(question)

    return {
      question,
    }
  }
}
