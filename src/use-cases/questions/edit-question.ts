import { QuestionsRepository } from '@/repositories/questions-repository'
import { Question } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { NotAllowedError } from '../errors/not-allowed-error'
import { UsersRepository } from '@/repositories/users-repository'

export interface EditQuestionUseCaseRequest {
  authorId: string
  questionId: string
  title: string
  content: string
}

export interface EditQuestionUseCaseResponse {
  question: Question
}

export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    title,
    content,
    authorId,
    questionId,
  }: EditQuestionUseCaseRequest): Promise<
    EditQuestionUseCaseResponse | ResourceNotFoundError | NotAllowedError
  > {
    const question = await this.questionsRepository.findById(questionId)
    const user = await this.usersRepository.findById(authorId)

    if (!question) {
      throw new ResourceNotFoundError()
    }

    if (authorId !== question.authorId && user?.role !== 'ADMINISTRATION') {
      throw new NotAllowedError()
    }

    question.title = title
    question.content = content

    await this.questionsRepository.save(question)

    return {
      question,
    }
  }
}
