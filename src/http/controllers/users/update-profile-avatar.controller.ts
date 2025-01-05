import { InvalidTypeError } from '@/use-cases/errors/invalidate-type-error'
import { makeUpdateProfileAvatarUseCase } from '@/use-cases/users/factories/make-update-profile-avatar-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function updateProfileAvatar(
  request: FastifyRequest,
  response: FastifyReply,
) {
  try {
    const updateProfileAvatar = makeUpdateProfileAvatarUseCase()

    const file = await request.file()

    if (!file) {
      return response.status(400).send({ error: 'File is required' })
    }

    const mimetype = file.mimetype

    if (!mimetype.startsWith('image/')) {
      throw new InvalidTypeError()
    }

    const userId = request.user.sub

    const { user } = await updateProfileAvatar.execute({
      file,
      userId,
    })

    return response.status(200).send({ user })
  } catch (error) {
    if (error instanceof InvalidTypeError) {
      return response.status(400).send({ message: error.message })
    }

    return response.status(500).send({ error: 'Failed to upload avatar' })
  }
}
