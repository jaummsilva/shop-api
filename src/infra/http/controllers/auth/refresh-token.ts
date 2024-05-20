import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import type { HttpServer } from '../../http-server'

export class RefreshTokenController {
  constructor(private httpServer: HttpServer) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      await this.httpServer.verifyJwt(request)
      const { token, refreshToken } = this.httpServer.signJwt(
        request.user.sub,
        request.user.role,
      )

      return reply
        .setCookie('refreshToken', refreshToken, {
          path: '/',
          secure: true,
          sameSite: true,
          httpOnly: true,
        })
        .status(200)
        .json({ token })
    } catch (error) {
      const errorMessage = 'Error occurred while refreshing token.'
      return reply.status(400).json({
        message: errorMessage,
      })
    }
  }
}
