import { ZodFetchOrdersQuerySchemaValidation } from '@/infra/validation/zod/zod-fetch-orders-schema-validation'

import { FecthOrdersController } from '../../controllers/order/fetch-orders'
import { FecthOrdersByUserController } from '../../controllers/order/fetch-orders-by-user'
import { OrderRegisterController } from '../../controllers/order/register'
import type { HttpServer } from '../../http-server'
import { NodemailerProvider } from '../../nodemailer/nodemailer.provider'

export class OrderRoutes {
  constructor(private httpServer: HttpServer) {}

  async init() {
    const isPrivateRoute = true
    const isAdmin = true
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

    const zodFetchOrdersBodySchemaValidation =
      new ZodFetchOrdersQuerySchemaValidation()
    const fetchOrdersController = new FecthOrdersController(
      zodFetchOrdersBodySchemaValidation,
    )

    this.httpServer.register(
      'get',
      '/orders',
      fetchOrdersController.handle.bind(fetchOrdersController),
      isPrivateRoute,
      isAdmin,
    )
  }
}
