import type { HttpMethods } from '@/core/types/http-methods'

import type { HttpRequest } from './http-request'
import type { HttpResponse } from './http-response'

export interface HttpServer {
  app: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    server: any
  }
  start(port: number, callback: () => void): void
  close(): Promise<void>
  register(
    method: HttpMethods,
    url: string,
    handler: (
      request: HttpRequest,
      reply: HttpResponse,
    ) => Promise<HttpResponse | undefined>,
    verifyJwt?: boolean,
    verifyRole?: boolean,
  ): void
  verifyJwt(request: HttpRequest): Promise<boolean>
  signJwt(
    sub: string,
    role: 'ADMIN' | 'MEMBER',
  ): { token: string; refreshToken: string }
}
