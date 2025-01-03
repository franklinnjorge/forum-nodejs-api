import { Answer } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { NotAllowedError } from '../errors/not-allowed-error'
import { UsersRepository } from '@/repositories/users-repository'
import { AnswersRepository } from '@/repositories/answer-repository'

export interface EditAnswerUseCaseRequest {
  content: string
  authorId: string
  answerId: string
}

export interface EditAnswerUseCaseResponse {
  answer: Answer
}

export class EditAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    content,
    authorId,
    answerId,
  }: EditAnswerUseCaseRequest): Promise<
    EditAnswerUseCaseResponse | ResourceNotFoundError | NotAllowedError
  > {
    const answer = await this.answersRepository.findById(answerId)
    const user = await this.usersRepository.findById(authorId)

    if (!answer) {
      throw new ResourceNotFoundError()
    }

    if (authorId !== answer.authorId && user?.role !== 'ADMINISTRATION') {
      throw new NotAllowedError()
    }

    answer.content = content

    await this.answersRepository.save(answer)

    return {
      answer,
    }
  }
}
