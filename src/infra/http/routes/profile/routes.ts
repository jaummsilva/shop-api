import { ProfileController } from '../../controllers/profile/get-profile'
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
  }
}
