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
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
