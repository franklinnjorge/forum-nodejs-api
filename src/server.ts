import swagger from '@fastify/swagger'
import { app } from './app'
import { env } from './env'
import { swaggerConfig } from './plugins/swagger'

app.register(swagger, swaggerConfig)

const start = async () => {
  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' })
    console.log('🚀 Server running at http://localhost:3333')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
