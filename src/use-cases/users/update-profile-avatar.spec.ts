import { describe, it, expect, vi } from 'vitest'
import { UpdateProfileAvatarUseCase } from './update-profile-avatar'
import { UsersRepository } from '@/repositories/users-repository'
import { uploadToS3, getImageByKey } from '@/services/s3-upload-service'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

vi.mock('@/services/s3-upload-service')

describe('UpdateProfileAvatarUseCase', () => {
  it('should update the user profile avatar', async () => {
    const mockUsersRepository = {
      updateProfileAvatar: vi.fn().mockResolvedValue({
        id: 'user-id',
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatarKey: 'avatar-key',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    } as unknown as UsersRepository

    const mockUploadToS3 = uploadToS3 as vi.Mock
    mockUploadToS3.mockResolvedValue({ Key: 'avatar-key' })

    const mockGetImageByKey = getImageByKey as vi.Mock
    mockGetImageByKey.mockResolvedValue('https://example.com/avatar.jpg')

    const updateProfileAvatarUseCase = new UpdateProfileAvatarUseCase(
      mockUsersRepository,
    )

    const result = await updateProfileAvatarUseCase.execute({
      file: {} as any, // Simulando um arquivo
      userId: 'user-id',
    })

    expect(mockUploadToS3).toHaveBeenCalledWith({}, 'user-id')
    expect(mockGetImageByKey).toHaveBeenCalledWith('avatar-key')
    expect(mockUsersRepository.updateProfileAvatar).toHaveBeenCalledWith({
      id: 'user-id',
      avatarKey: 'avatar-key',
    })
    expect(result.user).toEqual({
      id: 'user-id',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatarUrl: 'https://example.com/avatar.jpg',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it('should throw ResourceNotFoundError if user is not found', async () => {
    const mockUsersRepository = {
      updateProfileAvatar: vi.fn().mockResolvedValue(null),
    } as unknown as UsersRepository

    const updateProfileAvatarUseCase = new UpdateProfileAvatarUseCase(
      mockUsersRepository,
    )

    await expect(
      updateProfileAvatarUseCase.execute({
        file: {} as any, // Simulando um arquivo
        userId: 'non-existent-user-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
