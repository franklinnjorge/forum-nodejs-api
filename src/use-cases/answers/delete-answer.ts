import { UsersRepository } from '@/repositories/users-repository'
import { NotAllowedError } from '../errors/not-allowed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { AnswersRepository } from '@/repositories/answer-repository'

export interface DeleteAnswerUseCaseRequest {
  authorId: string
  answerId: string
}

export type DeleteAnswerUseCaseResponse =
  | ResourceNotFoundError
  | NotAllowedError

export class DeleteAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({ authorId, answerId }: DeleteAnswerUseCaseRequest) {
    const answer = await this.answersRepository.findById(answerId)
    const user = await this.usersRepository.findById(authorId)

    if (!answer) {
      throw new ResourceNotFoundError()
    }

    if (authorId !== answer.authorId && user?.role !== 'ADMINISTRATION') {
      throw new NotAllowedError()
    }

    await this.answersRepository.delete(answer)

    return {
      answer,
    }
  }
}
