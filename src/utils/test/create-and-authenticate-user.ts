import prisma from '@/prisma'
import { UserRole } from '@prisma/client'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  await prisma.user.create({
    data: {
      name: 'Franklin Jorge',
      email: 'franklin-jorge.ca@example.com',
      password_hash: await hash('123456', 6),
      role: isAdmin ? UserRole.ADMINISTRATION : UserRole.USER,
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'franklin-jorge.ca@example.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return {
    token,
  }
}
