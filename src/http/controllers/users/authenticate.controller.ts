import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credential-error'
import { makeAuthenticateUseCase } from '@/use-cases/users/factories/make-authenticate-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticate(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    const { user } = await authenticateUseCase.execute({ email, password })

    const token = await response.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )

    return response.status(200).send({ token })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return response.status(400).send({ message: error.message })
    }

    throw error
  }
}
