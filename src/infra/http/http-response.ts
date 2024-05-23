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
  send(payload?: string | Buffer | object): this
  status(code: number): this
  setCookie(name: string, value: string, options?: CookieOptions): this
  redirect(path: string): this
  type(type: string): this
}
