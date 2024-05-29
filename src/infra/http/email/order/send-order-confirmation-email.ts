import type { EmailOptions, EmailProvider } from '@/core/email/provider'
import type { Order } from '@/domain/enterprise/order'
import { env } from '@/infra/env'

import { generateOrderEmailTemplate } from './generate-order-email-template'

export async function sendOrderConfirmationEmail(
  provider: EmailProvider,
  order: Order,
  emails: string,
): Promise<void> {
  const mailOptions: EmailOptions = {
    from: env.EMAIL_USER,
    to: emails,
    subject: `Confirmação do Pedido #${order.id}`,
    html: generateOrderEmailTemplate(order),
  }

  await provider.sendMail(mailOptions)
}
