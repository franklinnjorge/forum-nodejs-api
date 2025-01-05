import fastifyJwt from '@fastify/jwt'
import { PrismaClient } from '@prisma/client'
import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import { answersRoutes } from './http/controllers/answers/routes'
import { questionsRoutes } from './http/controllers/questions/routes'
import { usersRoutes } from './http/controllers/users/routes'
import multipart from '@fastify/multipart'

export const app = fastify()
export const prisma = new PrismaClient()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(multipart, {
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
})

app.register(usersRoutes)
app.register(questionsRoutes)
app.register(answersRoutes)

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
