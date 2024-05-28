import { OrderRegisterController } from '../../controllers/order/register'
import type { HttpServer } from '../../http-server'

export class OrderRoutes {
  constructor(private httpServer: HttpServer) {}

  async init() {
    const isPrivateRoute = true
    const orderRegisterController = new OrderRegisterController()

    this.httpServer.register(
      'post',
      '/store/order',
      orderRegisterController.handle.bind(orderRegisterController),
      isPrivateRoute,
    )
  }
}
