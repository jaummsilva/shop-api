import { fromError } from 'zod-validation-error'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import { makeFetchOrdersByUserUseCase } from './factories/make-fetch-orders-by-user-use-case '
import { OrdersPresenter } from './presenter/order-presenter'

export class FecthOrdersByUserController {
  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const fecthOrdersByUserUseCase = makeFetchOrdersByUserUseCase()

      const result = await fecthOrdersByUserUseCase.execute({
        userId: request.user.sub,
      })

      if (result.isRight()) {
        const { orders } = result.value

        return reply.status(200).json({
          orders: orders.map((order) => ({
            ...OrdersPresenter.toHttp(order),
          })),
        })
      }
    } catch (error) {
      const validationError = fromError(error)

      return reply.status(400).json({
        message: validationError.details,
      })
    }
  }
}
