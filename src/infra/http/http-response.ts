export interface CookieOptions {
  path?: string
  domain?: string
  expires?: Date
  maxAge?: number
  secure?: boolean
  httpOnly?: boolean
  sameSite?: true | false
}

export interface HttpResponse {
  json(data: object | undefined): this
  send(): this
  status(code: number): this
  setCookie(name: string, value: string, options?: CookieOptions): this
}
