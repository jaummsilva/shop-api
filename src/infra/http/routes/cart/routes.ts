import { ZodAddToCartQuerySchemaValidation } from '@/infra/validation/zod/zod-add-to-cart-schema-validation'
import { ZodClearProductFromCartQuerySchemaValidation } from '@/infra/validation/zod/zod-clear-product-from-cart-schema-validation'
import { ZodUpdateProductQuantityInCartBodySchemaValidation } from '@/infra/validation/zod/zod-update-product-quantity-in-cart-body-schema-validation'

import { AddToCartController } from '../../controllers/cart/add-to-cart'
import { ClearItemsFromCartController } from '../../controllers/cart/clear-items-from-cart'
import { ClearProductFromCartController } from '../../controllers/cart/clear-product-from-cart'
import { GetCartController } from '../../controllers/cart/get-cart'
import { UpdateProductQuantityInCartController } from '../../controllers/cart/update-product-quantity-in-cart'
import type { HttpServer } from '../../http-server'

export class CartRoutes {
  constructor(private httpServer: HttpServer) {}

  async init() {
    const isPrivateRoute = true
    const getCartController = new GetCartController()

    this.httpServer.register(
      'get',
      '/store/cart',
      getCartController.handle.bind(getCartController),
      isPrivateRoute,
    )

    const zodAddToCartQuerySchemaValidation =
      new ZodAddToCartQuerySchemaValidation()
    const addToCartController = new AddToCartController(
      zodAddToCartQuerySchemaValidation,
    )

    this.httpServer.register(
      'post',
      '/store/cart',
      addToCartController.handle.bind(addToCartController),
      isPrivateRoute,
    )

    const zodUpdateProductQuantityInCartBodySchemaValidation =
      new ZodUpdateProductQuantityInCartBodySchemaValidation()
    const updateProductQuantityInCartController =
      new UpdateProductQuantityInCartController(
        zodUpdateProductQuantityInCartBodySchemaValidation,
      )

    this.httpServer.register(
      'put',
      '/store/cart',
      updateProductQuantityInCartController.handle.bind(
        updateProductQuantityInCartController,
      ),
      isPrivateRoute,
    )

    const clearItemsFromCartController = new ClearItemsFromCartController()

    this.httpServer.register(
      'post',
      '/store/cart/clear',
      clearItemsFromCartController.handle.bind(clearItemsFromCartController),
      isPrivateRoute,
    )

    const zodClearItemsFromCartBodySchemaValidation =
      new ZodClearProductFromCartQuerySchemaValidation()
    const clearProductFromCartController = new ClearProductFromCartController(
      zodClearItemsFromCartBodySchemaValidation,
    )

    this.httpServer.register(
      'post',
      '/store/cart/product/clear',
      clearProductFromCartController.handle.bind(
        clearProductFromCartController,
      ),
      isPrivateRoute,
    )
  }
}
