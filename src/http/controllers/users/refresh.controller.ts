import { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(request: FastifyRequest, response: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })

  const { role } = request.user
  const token = await response.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
      },
    },
  )

  const refreshToken = await response.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
        expiresIn: '7d',
      },
    },
  )

  return response
    .status(200)
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .send({ token })
}
