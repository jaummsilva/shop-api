import { OrderRegisterController } from '../../controllers/order/register'
import type { HttpServer } from '../../http-server'
import { NodemailerProvider } from '../../nodemailer/nodemailer.provider'

export class OrderRoutes {
  constructor(private httpServer: HttpServer) {}

  async init() {
    const isPrivateRoute = true
    const emailProvider = new NodemailerProvider()

    const orderRegisterController = new OrderRegisterController(emailProvider)

    this.httpServer.register(
      'post',
      '/store/order',
      orderRegisterController.handle.bind(orderRegisterController),
      isPrivateRoute,
    )
  }
}
