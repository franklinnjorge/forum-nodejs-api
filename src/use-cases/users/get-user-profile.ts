import { UsersRepository } from '@/repositories/users-repository'
import { getImageByKey } from '@/services/s3-upload-service'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface GetUserProfileUseCaseRequest {
  userId: string
}

interface GetUserProfileUseCaseResponse {
  user: {
    id: string
    name: string
    email: string
    avatarUrl: string
    createdAt: Date
    updatedAt: Date | null
  }
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)
    let avatarUrl = ''

    if (!user) {
      throw new ResourceNotFoundError()
    }

    if (user.avatarKey) {
      avatarUrl = await getImageByKey(user.avatarKey)
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    }
  }
}
