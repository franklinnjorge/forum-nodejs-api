import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { FastifyPluginAsync } from 'fastify'

export const swaggerConfig: FastifyPluginAsync = async (app) => {
  app.register(fastifySwagger, {
    swagger: {
      info: {
        title: 'Forum API',
        description: 'API documentation for the Forum project',
        version: '1.0.0',
      },
      host: 'localhost:3333',
      schemes: ['http'],
      consumes: ['application/json', 'multipart/form-data'],
      produces: ['application/json'],
    },
  })

  app.register(fastifySwaggerUi, {
    routePrefix: '/docs', // Ensure Swagger UI is available at /docs
    uiConfig: {
      docExpansion: 'full', // Expand docs by default
      deepLinking: false,
    },
    staticCSP: true,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject
    },
    transformSpecificationClone: true,
  })
}
