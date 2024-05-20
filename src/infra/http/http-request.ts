export interface HttpRequest {
  get body(): object | undefined
  get query(): {
    [key: string]: string
  }
  get params(): {
    [key: string]: string
  }
  get user(): {
    sub: string
    role: 'ADMIN' | 'MEMBER'
  }
  jwtVerify(): Promise<void>
}
