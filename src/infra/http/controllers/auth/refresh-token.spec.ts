import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { createAndAuthenticateUser } from '@/infra/utils/test/create-and-authenticate-user'
import { app } from '@/main'

import { FastifyAdapter } from '../../fastify/fastify-adapter'
import type { HttpServer } from '../../http-server'

let httpServer: HttpServer

describe('Refresh Token (e2e)', () => {
  beforeAll(() => {
    httpServer = new FastifyAdapter()
  })

  afterAll(() => {
    httpServer.close()
  })

  it('should be able to refresh a token', async () => {
    const token = await createAndAuthenticateUser(app)

    await request(app.instance.server)
      .post('/user')
      .send({
        name: 'TESTE USER',
        email: 'teste2@gmail.com',
        password: '123456',
        role: 'ADMIN',
      })
      .set('Authorization', `Bearer ${token}`)

    const authResponse = await request(app.instance.server)
      .post('/session')
      .send({
        email: 'teste2@gmail.com',
        password: '123456',
      })

    const cookies = authResponse.get('Set-Cookie') ?? ['']

    const response = await request(app.instance.server)
      .put('/refresh-token')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
