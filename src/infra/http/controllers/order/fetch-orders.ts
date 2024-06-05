import { fromError } from 'zod-validation-error'

import type { Validation } from '@/core/validation/validation'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import { makeFetchOrdersUseCase } from './factories/make-fetch-orders-use-case'
import { OrdersPresenter } from './presenter/order-presenter'

export class FecthOrdersController {
  constructor(
    private bodyValidation: Validation<{
      query?: string
      page?: number
      perPage?: number
    }>,
  ) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const { query, page, perPage } = this.bodyValidation.parse(request.query)

      const fecthProductsCase = makeFetchOrdersUseCase()

      const result = await fecthProductsCase.execute({ query, page, perPage })

      if (result.isRight()) {
        const { orders, meta } = result.value

        return reply.status(200).json({
          orders: orders.map((order) => ({
            ...OrdersPresenter.toHttp(order),
          })),
          meta,
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
