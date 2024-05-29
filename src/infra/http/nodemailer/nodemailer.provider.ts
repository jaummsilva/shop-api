// Implementação usando Nodemailer como exemplo
import * as nodemailer from 'nodemailer'

import type { EmailOptions, EmailProvider } from '@/core/email/provider'
import { env } from '@/infra/env'

export class NodemailerProvider implements EmailProvider {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    })
  }

  async sendMail(options: EmailOptions): Promise<void> {
    const mailOptions = {
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    }

    await this.transporter.sendMail(mailOptions)
  }
}
