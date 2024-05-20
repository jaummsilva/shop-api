import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import type { CheckIn } from '@/domain/enterprise/check-in'
import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/main'

import { FastifyAdapter } from '../../fastify/fastify-adapter'
import type { HttpServer } from '../../http-server'
import { createAndAuthenticateUser } from '../../utils/test/create-and-authenticate-user'

let httpServer: HttpServer

describe('Fetch User Check Ins History (e2e)', () => {
  beforeAll(() => {
    httpServer = new FastifyAdapter()
  })

  afterAll(() => {
    httpServer.close()
  })

  it('should be able to fetch user check-ins history', async () => {
    const token = await createAndAuthenticateUser(app)

    await request(app.instance.server)
      .post('/gym')
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -20,
        longitude: -180,
        phone: '123456789',
        description: null,
        title: 'TESTE TITLE',
      })

    const gym = await prisma.gym.findFirst({
      select: {
        id: true,
      },
    })

    await request(app.instance.server)
      .post('/check-in')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userLatitude: -20,
        userLongitude: -180,
        gymId: gym?.id,
      })

    const response = await request(app.instance.server)
      .get('/user/check-ins-history')
      .set('Authorization', `Bearer ${token}`)

    const responseBody: {
      checkIns: CheckIn[]
    } = response.body

    expect(response.statusCode).toEqual(200)
    expect(responseBody.checkIns.length).toEqual(1)
  })
})
