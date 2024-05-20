import { ZodAuthenticateBodySchemaValidation } from '@/infra/validation/zod/zod-authenticate-body-schema-validation.ts'

import { AuthenticateController } from '../../controllers/auth/authenticate'
import { RefreshTokenController } from '../../controllers/auth/refresh-token'
import type { HttpServer } from '../../http-server'

export class AuthRoutes {
  constructor(private httpServer: HttpServer) {}

  async init() {
    const zodAuthenticateBodySchemaValidation =
      new ZodAuthenticateBodySchemaValidation()
    const authenticateController = new AuthenticateController(
      this.httpServer,
      zodAuthenticateBodySchemaValidation,
    )

    this.httpServer.register(
      'post',
      '/session',
      authenticateController.handle.bind(authenticateController),
    )

    const refreshTokenController = new RefreshTokenController(this.httpServer)
    this.httpServer.register(
      'put',
      '/refresh-token',
      refreshTokenController.handle.bind(refreshTokenController),
    )
  }
}
