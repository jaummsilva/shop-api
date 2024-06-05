import { FecthOrdersByUserController } from '../../controllers/order/fetch-orders-by-user'
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

    const fetchOrdersByUserController = new FecthOrdersByUserController()

    this.httpServer.register(
      'get',
      '/store/orders',
      fetchOrdersByUserController.handle.bind(fetchOrdersByUserController),
      isPrivateRoute,
    )
  }
}
