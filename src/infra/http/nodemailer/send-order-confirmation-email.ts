import nodemailer from 'nodemailer'

import type { Order } from '@/domain/enterprise/order'
import { env } from '@/infra/env'

import { generateOrderEmailTemplate } from './generate-order-email-template'

export async function sendOrderConfirmationEmail(order: Order, emails: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  })

  const mailOptions = {
    from: env.EMAIL_USER,
    to: emails,
    subject: `Confirmação do Pedido #${order.id}`,
    html: generateOrderEmailTemplate(order),
  }

  transporter.sendMail(mailOptions)
}
