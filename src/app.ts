import fastifyJwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { PrismaClient } from '@prisma/client'
import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import { answersRoutes } from './http/controllers/answers/routes'
import { questionsRoutes } from './http/controllers/questions/routes'
import { usersRoutes } from './http/controllers/users/routes'

export const app = fastify({
  logger: true,
})

export const prisma = new PrismaClient()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(multipart, {
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
})

const swaggerOptions = {
  openapi: {
    info: {
      title: 'Forum API',
      description: 'API for a forum application',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
    consumes: ['application/json', 'multipart/form-data'],
    produces: ['application/json'],
    tags: [
      { name: 'Users', description: 'User related endpoints' },
      { name: 'Questions', description: 'Question related endpoints' },
      { name: 'Answers', description: 'Answer related endpoints' },
    ],
  },
}

const swaggerUiOptions = {
  routePrefix: '/docs',
  exposeRoute: true,
  staticCSP: true,
}

app.register(fastifySwagger, swaggerOptions)
app.register(fastifySwaggerUi, swaggerUiOptions)

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
