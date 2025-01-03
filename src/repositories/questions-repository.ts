import { Prisma, Question } from '@prisma/client'
import { ListQuestions } from './prisma/mappers/question-mapper'

export interface QuestionsRepository {
  findByAuthorId(authorId: string): Promise<Question | null>
  findById(id: string): Promise<Question | null>
  create(data: Prisma.QuestionUncheckedCreateInput): Promise<Question>
  findManyPaginated(
    page: number,
    limit: number,
  ): Promise<{ questions: ListQuestions[]; total: number }>
  save(question: Question): Promise<Question>
  delete(question: Question): Promise<void>
}
