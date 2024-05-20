import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/main'

import { FastifyAdapter } from '../../fastify/fastify-adapter'
import type { HttpServer } from '../../http-server'

let httpServer: HttpServer

describe('Authenticate (e2e)', () => {
  beforeAll(() => {
    httpServer = new FastifyAdapter()
  })

  afterAll(() => {
    httpServer.close()
  })

  it('should be able to authenticate', async () => {
    await request(app.instance.server).post('/user').send({
      name: 'TESTE USER',
      email: 'teste@gmail.com',
      password: '123456',
      role: 'ADMIN',
    })

    const response = await request(app.instance.server).post('/session').send({
      email: 'teste@gmail.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)

    // Accessing tokens from cookies
    const cookies = response.get('Set-Cookie') ?? ['']
    const token = extractTokenFromCookies(cookies, 'token')
    const refreshToken = extractTokenFromCookies(cookies, 'refreshToken')

    // Expect statements for tokens
    expect(token).toBeDefined()
    expect(refreshToken).toBeDefined()
    expect(typeof token).toBe('string')
    expect(typeof refreshToken).toBe('string')
  })
})

function extractTokenFromCookies(
  cookies: string[] | undefined,
  cookieName: string,
): string | undefined {
  if (!cookies) {
    return undefined
  }

  // Find the cookie with the specified name
  const cookie = cookies.find((c) => c.includes(`${cookieName}=`))

  if (!cookie) {
    return undefined
  }

  // Extract the token from the cookie
  const match = cookie.match(new RegExp(`${cookieName}=([^;]+)`))

  if (match) {
    return match[1]
  }

  return undefined
}
