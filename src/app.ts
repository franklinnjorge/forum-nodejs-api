import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
import { usersRoutes } from './http/controllers/users/routes'
import { ZodError } from 'zod'
import { env } from './env'

export const app = fastify()
export const prisma = new PrismaClient()

app.register(usersRoutes)

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    reply
      .status(400)
      .send({ message: 'Validation Error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // todo Here I should log the error with datadog or sentry or any other service
  }
})
