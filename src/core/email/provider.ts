export interface EmailOptions {
  from: string
  to: string | string[]
  subject: string
  html: string
}

export interface EmailProvider {
  sendMail(options: EmailOptions): Promise<void>
}
