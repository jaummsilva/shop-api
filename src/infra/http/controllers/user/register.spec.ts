import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/main'

import { FastifyAdapter } from '../../fastify/fastify-adapter'
import type { HttpServer } from '../../http-server'

let httpServer: HttpServer

describe('Register (e2e)', () => {
  beforeAll(() => {
    httpServer = new FastifyAdapter()
  })

  afterAll(() => {
    httpServer.close()
  })

  it('should be able to register', async () => {
    const response = await request(app.instance.server).post('/user').send({
      name: 'TESTE USER',
      email: 'teste@gmail.com',
      password: '123456',
      role: 'ADMIN',
    })

    expect(response.statusCode).toEqual(201)
  })
})
