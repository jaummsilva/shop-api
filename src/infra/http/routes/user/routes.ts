import { ZodFetchUsersQuerySchemaValidation } from '@/infra/validation/zod/zod-fetch-users-schema-validation'
import { ZodUserRegisterBodySchemaValidation } from '@/infra/validation/zod/zod-register-user-body-schema-validation'

import { FecthUsersController } from '../../controllers/user/fetch-users'
import { UserController } from '../../controllers/user/register'
import type { HttpServer } from '../../http-server'

export class UserRoutes {
  constructor(private httpServer: HttpServer) {}

  async init() {
    const isPrivateRoute = true
    const isAdmin = true

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
      isAdmin,
    )

    const zodFetchUsersBodySchemaValidation =
      new ZodFetchUsersQuerySchemaValidation()
    const fetchUsersController = new FecthUsersController(
      this.httpServer,
      zodFetchUsersBodySchemaValidation,
    )

    this.httpServer.register(
      'get',
      '/users',
      fetchUsersController.handle.bind(fetchUsersController),
      isPrivateRoute,
      isAdmin,
    )
  }
}
