import { env } from './infra/env'
import { FastifyAdapter } from './infra/http/fastify/fastify-adapter'
import type { HttpServer } from './infra/http/http-server'
import { AuthRoutes } from './infra/http/routes/auth/routes'
import { CartRoutes } from './infra/http/routes/cart/routes'
import { OrderRoutes } from './infra/http/routes/order/routes'
import { ProductRoutes } from './infra/http/routes/product/routes'
import { ProfileRoutes } from './infra/http/routes/profile/routes'
import { UserRoutes } from './infra/http/routes/user/routes'

export default class App {
  private httpServer: HttpServer
  constructor() {
    this.httpServer = new FastifyAdapter()
  }

  async start() {
    await new AuthRoutes(this.httpServer).init()
    await new UserRoutes(this.httpServer).init()
    await new ProfileRoutes(this.httpServer).init()
    await new ProductRoutes(this.httpServer).init()
    await new CartRoutes(this.httpServer).init()
    await new OrderRoutes(this.httpServer).init()

    this.httpServer.start(env.PORT, () => {
      console.log('HTTP Running!')
    })
  }

  async close() {
    this.httpServer.close()
  }

  get instance() {
    return this.httpServer.app
  }
}

export const app = new App()

app.start()
