import { ZodUserDeleteBodySchemaValidation } from '@/infra/validation/zod/zod-delete-user-body-schema-validation'
import { ZodFetchUsersQuerySchemaValidation } from '@/infra/validation/zod/zod-fetch-users-schema-validation'
import { ZodGetImageUserBodySchemaValidation } from '@/infra/validation/zod/zod-get-image-user-query-schema-validation'
import { ZodUserRegisterBodySchemaValidation } from '@/infra/validation/zod/zod-register-user-body-schema-validation'
import { ZodUserStatusUpdateBodySchemaValidation } from '@/infra/validation/zod/zod-update-status-user-body-schema-validation'
import { ZodUserUpdateBodySchemaValidation } from '@/infra/validation/zod/zod-update-user-body-schema-validation'

import { UserDeleteController } from '../../controllers/user/delete'
import { FecthUsersController } from '../../controllers/user/fetch-users'
import { GetImageUserController } from '../../controllers/user/get-image'
import { UserController } from '../../controllers/user/register'
import { UserUpdateController } from '../../controllers/user/update'
import { UserUpdateStatusController } from '../../controllers/user/update-status'
import type { HttpServer } from '../../http-server'

export class UserRoutes {
  constructor(private httpServer: HttpServer) {}

  async init() {
    const isPrivateRoute = true
    const isAdmin = true

    // Registering POST /user route
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

    // Registering GET /users route
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

    // Registering PUT /users route
    const zodUserUpdateBodySchemaValidation =
      new ZodUserUpdateBodySchemaValidation()
    const userUpdatecontroller = new UserUpdateController(
      this.httpServer,
      zodUserUpdateBodySchemaValidation,
    )

    this.httpServer.register(
      'put',
      '/user',
      userUpdatecontroller.handle.bind(userUpdatecontroller),
      isPrivateRoute,
      isAdmin,
    )

    const zodUserDeleteBodySchemaValidation =
      new ZodUserDeleteBodySchemaValidation()
    const userDeleteController = new UserDeleteController(
      this.httpServer,
      zodUserDeleteBodySchemaValidation,
    )

    this.httpServer.register(
      'delete',
      '/user/:userId',
      userDeleteController.handle.bind(userDeleteController),
      isPrivateRoute,
      isAdmin,
    )

    const zodUserStatusUpdateBodySchemaValidation =
      new ZodUserStatusUpdateBodySchemaValidation()
    const userStatusUpdatecontroller = new UserUpdateStatusController(
      this.httpServer,
      zodUserStatusUpdateBodySchemaValidation,
    )

    this.httpServer.register(
      'put',
      '/user/status',
      userStatusUpdatecontroller.handle.bind(userStatusUpdatecontroller),
      isPrivateRoute,
      isAdmin,
    )

    const zodGetImageUserBodySchemaValidation =
      new ZodGetImageUserBodySchemaValidation()
    const getImageUserController = new GetImageUserController(
      zodGetImageUserBodySchemaValidation,
    )

    this.httpServer.register(
      'get',
      '/user/get-image/:imageName',
      getImageUserController.handle.bind(getImageUserController),
      isPrivateRoute,
      isAdmin,
    )
  }
}
