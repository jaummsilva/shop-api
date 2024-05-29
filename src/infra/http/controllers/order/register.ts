import { fromError } from 'zod-validation-error'

import type { EmailProvider } from '@/core/email/provider'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { sendOrderConfirmationEmail } from '../../email/order/send-order-confirmation-email'
import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import { makeOrdersRegisterUseCase } from './factories/make-orders-register-use-case'

export class OrderRegisterController {
  constructor(private emailProvider: EmailProvider) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const ordersRegisterCase = makeOrdersRegisterUseCase()

      const result = await ordersRegisterCase.execute({
        userId: request.user.sub,
      })

      if (result.isLeft()) {
        const error = result.value

        if (error instanceof ResourceNotFoundError) {
          return reply.status(400).json({
            message: error.message,
          })
        }
      }

      if (result.isRight()) {
        const userEmails = result.value.users
          .map((user) => user.email)
          .join(',')

        // Enviar email para os administradores com o pedido
        await sendOrderConfirmationEmail(
          this.emailProvider,
          result.value.order,
          userEmails,
        )

        return reply.status(201).json({
          orderId: result.value.order.id.toString(),
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
