import { FastifyReply } from 'fastify'

import { type CookieOptions, HttpResponse } from '../http-response' // Importe a interface HttpResponse aqui

export class FastifyHttpResponseAdapter implements HttpResponse {
  private response: FastifyReply

  constructor(response: FastifyReply) {
    this.response = response
  }

  json(data: object | undefined): this {
    this.response.send(data)
    return this
  }

  send(): this {
    this.response.send()
    return this
  }

  status(code: number): this {
    this.response.status(code)
    return this
  }

  setCookie(name: string, value: string, options?: CookieOptions): this {
    this.response.setCookie(name, value, options)
    return this
  }
}
