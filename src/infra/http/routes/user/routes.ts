import { ZodUserRegisterBodySchemaValidation } from '@/infra/validation/zod/zod-register-user-body-schema-validation'

import { UserController } from '../../controllers/user/register'
import type { HttpServer } from '../../http-server'

export class UserRoutes {
  constructor(private httpServer: HttpServer) {}

  async init() {
    const isPrivateRoute = true
    const zodUserRegisterBodySchemaValidation =
      new ZodUserRegisterBodySchemaValidation()
    const userController = new UserController(
      this.httpServer,
      zodUserRegisterBodySchemaValidation,
    )

    this.httpServer.register(
      'post',
      '/user',
      userController.handle.bind(userController),
      isPrivateRoute,
    )
  }
}
