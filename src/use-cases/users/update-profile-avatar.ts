import { UsersRepository } from '@/repositories/users-repository'
import {
  deleteImageByKey,
  getImageByKey,
  uploadToS3,
} from '@/services/s3-upload-service'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { MultipartFile } from '@fastify/multipart'

interface UpdateProfileAvatarUseCaseRequest {
  file: MultipartFile
  userId: string
}

export interface UpdateProfileAvatarUseCaseResponse {
  user: {
    id: string
    name: string
    email: string
    avatarUrl: string
    createdAt: Date
    updatedAt: Date | null
  }
}

export class UpdateProfileAvatarUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    file,
    userId,
  }: UpdateProfileAvatarUseCaseRequest): Promise<UpdateProfileAvatarUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    if (user.avatarKey) {
      await deleteImageByKey(user.avatarKey)
    }

    const uploadResult = await uploadToS3(file, userId)
    const avatarKey = uploadResult.Key as string
    const avatarUrl = await getImageByKey(avatarKey)

    const userUpdated = await this.usersRepository.updateProfileAvatar({
      id: userId,
      avatarKey,
    })

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user: {
        id: userUpdated.id,
        name: userUpdated.name,
        email: userUpdated.email,
        avatarUrl,
        createdAt: userUpdated.createdAt,
        updatedAt: userUpdated.updatedAt,
      },
    }
  }
}
