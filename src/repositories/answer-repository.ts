import { Prisma, Answer, Question } from '@prisma/client'

export interface AnswersRepository {
  findByAuthorId(authorId: string): Promise<Answer | null>
  findById(id: string): Promise<Answer | null>
  create(data: Prisma.AnswerUncheckedCreateInput): Promise<Answer>
  findManyPaginatedByQuestionId(
    page: number,
    limit: number,
    questionId: string,
  ): Promise<{ question: Question; answers: Answer[]; total: number }>
  save(answer: Answer): Promise<Answer>
  delete(answer: Answer): Promise<void>
}
