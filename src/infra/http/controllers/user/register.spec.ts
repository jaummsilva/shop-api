import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { createAndAuthenticateUser } from '@/infra/utils/test/create-and-authenticate-user'
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
    const token = await createAndAuthenticateUser(app)

    const response = await request(app.instance.server)
      .post('/user')
      .send({
        name: 'TESTE USER',
        email: 'teste2@gmail.com',
        password: '123456',
        role: 'ADMIN',
        phone: '123456789',
        photoPath: '/path/to/photo.jpg',
        birthdate: '1990-01-01',
      })
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(201)
  })
})
