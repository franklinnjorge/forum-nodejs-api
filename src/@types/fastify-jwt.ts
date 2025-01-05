import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      role: 'ADMINISTRATION' | 'USER'
      sub: string
    }
  }
}
