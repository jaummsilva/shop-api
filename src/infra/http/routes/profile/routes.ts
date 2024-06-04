import { ZodUpdateProfileBodySchemaValidation } from '@/infra/validation/zod/zod-update-profile-body-schema-validation'

import { ProfileController } from '../../controllers/profile/get-profile'
import { UpdateProfileController } from '../../controllers/profile/update-profile'
import type { HttpServer } from '../../http-server'

export class ProfileRoutes {
  constructor(private httpServer: HttpServer) {}

  async init() {
    const isPrivateRoute = true
    const profileController = new ProfileController()

    this.httpServer.register(
      'get',
      '/profile',
      profileController.handle.bind(profileController),
      isPrivateRoute,
    )

    const zodUpdateProfileBodySchemaValidation =
      new ZodUpdateProfileBodySchemaValidation()

    const updateProfileController = new UpdateProfileController(
      zodUpdateProfileBodySchemaValidation,
    )

    this.httpServer.register(
      'put',
      '/profile',
      updateProfileController.handle.bind(updateProfileController),
      isPrivateRoute,
    )
  }
}
