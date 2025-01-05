import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeGetUserProfileUseCase } from '@/use-cases/users/factories/make-get-user-profile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(request: FastifyRequest, response: FastifyReply) {
  const getUserProfile = makeGetUserProfileUseCase()

  try {
    const { user } = await getUserProfile.execute({ userId: request.user.sub })

    return response.status(200).send({
      user: {
        ...user,
        password_hash: undefined,
      },
    })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return response.status(400).send({ message: error.message })
    }

    return response.status(500).send({ message: 'Internal Server Error' })
  }
}
