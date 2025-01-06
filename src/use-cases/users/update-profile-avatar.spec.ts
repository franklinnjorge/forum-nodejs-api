import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UpdateProfileAvatarUseCase } from './update-profile-avatar'
import { MultipartFile } from '@fastify/multipart'
import {
  deleteImageByKey,
  getImageByKey,
  uploadToS3,
} from '@/services/s3-upload-service'

let userRepository: InMemoryUsersRepository
let sut: UpdateProfileAvatarUseCase

describe('Update Profile Avatar Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new UpdateProfileAvatarUseCase(userRepository)
  })

  vi.mock('@/services/s3-upload-service', () => ({
    deleteImageByKey: vi.fn(),
    getImageByKey: vi.fn(),
    uploadToS3: vi.fn(),
  }))

  describe('Update Profile Avatar Use Case', () => {
    beforeEach(() => {
      userRepository = new InMemoryUsersRepository()
      sut = new UpdateProfileAvatarUseCase(userRepository)
    })

    it('should be able to update profile avatar', async () => {
      const newUser = await userRepository.create({
        name: 'Franklin Jorge',
        email: 'franklin-jorge.ca@example.com',
        password_hash: await hash('123456', 6),
      })

      const file = {
        filename: 'avatar.png',
        mimetype: 'image/png',
        data: Buffer.from(''),
      } as unknown as MultipartFile

      const uploadResult = {
        Key: 'avatar-key',
        $metadata: { httpStatusCode: 200 },
      }
      const avatarUrl = 'https://s3.amazonaws.com/bucket/avatar-key'

      vi.mocked(uploadToS3).mockResolvedValue(uploadResult)
      vi.mocked(getImageByKey).mockResolvedValue(avatarUrl)

      const { user } = await sut.execute({ file, userId: newUser.id })

      expect(user.avatarUrl).toEqual(avatarUrl)
      expect(user.name).toEqual('Franklin Jorge')
    })

    it('should delete old avatar if exists', async () => {
      const newUser = await userRepository.create({
        name: 'Franklin Jorge',
        email: 'franklin-jorge.ca@example.com',
        password_hash: await hash('123456', 6),
        avatarKey: 'old-avatar-key',
      })

      const file = {
        filename: 'avatar.png',
        mimetype: 'image/png',
        data: Buffer.from(''),
      } as unknown as MultipartFile
      const uploadResult = {
        Key: 'new-avatar-key',
        $metadata: { httpStatusCode: 200 },
      }
      const avatarUrl = 'https://s3.amazonaws.com/bucket/new-avatar-key'

      vi.mocked(uploadToS3).mockResolvedValue(uploadResult)
      vi.mocked(getImageByKey).mockResolvedValue(avatarUrl)

      const { user } = await sut.execute({ file, userId: newUser.id })

      expect(deleteImageByKey).toHaveBeenCalledWith('old-avatar-key')
      expect(user.avatarUrl).toEqual(avatarUrl)
    })

    it('should not be able to update profile avatar with wrong id', async () => {
      const file = {
        filename: 'avatar.png',
        mimetype: 'image/png',
        data: Buffer.from(''),
      } as unknown as MultipartFile

      await expect(async () => {
        await sut.execute({
          file,
          userId: 'not-exists-id',
        })
      }).rejects.toBeInstanceOf(ResourceNotFoundError)
    })
  })
})
