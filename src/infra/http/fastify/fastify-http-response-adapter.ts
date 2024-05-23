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

  send(payload?: string | Buffer | object): this {
    this.response.send(payload)
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

  redirect(path: string): this {
    this.response.redirect(path)
    return this
  }

  type(type: string): this {
    this.response.type(type)
    return this
  }
}
