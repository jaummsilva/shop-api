import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastify, {
  type FastifyInstance,
  type FastifyReply,
  type FastifyRequest,
} from 'fastify'

import type { HttpMethods } from '@/core/types/http-methods.js'
import { env } from '@/infra/env/index.js'

import type { HttpRequest } from '../http-request.js'
import type { HttpResponse } from '../http-response.js'
import type { HttpServer } from '../http-server.js'
import { FastifyHttpRequestAdapter } from './fastify-http-request-adapter.js'
import { FastifyHttpResponseAdapter } from './fastify-http-response-adapter.js'

export class FastifyAdapter implements HttpServer {
  app: FastifyInstance

  constructor() {
    this.app = fastify()
  }

  start(port: number, callback: () => void) {
    this.app.register(fastifyCors, {})

    this.app.register(fastifyJwt, {
      secret: env.JWT_SECRET,
      cookie: {
        cookieName: 'refreshToken',
        signed: false,
      },
      sign: {
        expiresIn: '1h',
      },
    })

    this.app.register(fastifyCookie, {})

    this.app.listen(
      {
        host: '0.0.0.0',
        port,
      },
      callback,
    )
  }

  async close() {
    await this.app.close()
  }

  register(
    method: HttpMethods,
    url: string,
    handler: (
      request: HttpRequest,
      reply: HttpResponse,
    ) => Promise<HttpResponse>,
    verifyJwt?: boolean,
    verifyRole?: boolean,
  ) {
    this.app[method](
      url,
      async (request: FastifyRequest, reply: FastifyReply) => {
        const wrappedRequest = new FastifyHttpRequestAdapter(request)
        const wrappedResponse = new FastifyHttpResponseAdapter(reply)

        if (verifyJwt === true) {
          const isJwtValid = await this.verifyJwt(wrappedRequest)

          if (!isJwtValid) {
            return wrappedResponse.status(401).json({ message: 'Unauthorized' })
          }
        }

        if (verifyRole === true) {
          const { role } = wrappedRequest.user

          if (role !== 'ADMIN') {
            return wrappedResponse.status(401).json({ message: 'Unauthorized' })
          }
        }

        return await handler(wrappedRequest, wrappedResponse)
      },
    )
  }

  async verifyJwt(request: HttpRequest) {
    try {
      await request.jwtVerify()
    } catch (error) {
      return false
    }

    return true
  }

  signJwt(sub: string, role: 'ADMIN' | 'MEMBER') {
    const tokenExpiresIn = '1h' // Tempo de expiração do token de acesso
    const refreshTokenExpiresIn = '7d' // Tempo de expiração do refresh token

    const token = this.app.jwt.sign(
      { sub, role },
      { expiresIn: tokenExpiresIn },
    )
    const refreshToken = this.app.jwt.sign(
      { sub, role },
      { expiresIn: refreshTokenExpiresIn },
    )

    return {
      token,
      refreshToken,
    }
  }
}
