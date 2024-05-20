import { type FastifyRequest } from 'fastify'

import type { HttpRequest } from '../http-request'

export class FastifyHttpRequestAdapter implements HttpRequest {
  private req: FastifyRequest

  constructor(req: FastifyRequest) {
    this.req = req
  }

  get body(): object | undefined {
    return this.req.body as object | undefined
  }

  get query(): { [key: string]: string } {
    return this.req.query as { [key: string]: string }
  }

  get params(): { [key: string]: string } {
    return this.req.params as { [key: string]: string }
  }

  get user(): { sub: string; role: 'ADMIN' | 'MEMBER' } {
    return this.req.user
  }

  async jwtVerify(): Promise<void> {
    await this.req.jwtVerify()
  }
}
