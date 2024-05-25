import { ZodProductDeleteBodySchemaValidation } from '@/infra/validation/zod/zod-delete-product-body-schema-validation'
import { ZodFetchProductsQuerySchemaValidation } from '@/infra/validation/zod/zod-fetch-products-schema-validation'
import { ZodGetProductImagesBodySchemaValidation } from '@/infra/validation/zod/zod-get-product-images-query-schema-validation'
import { ZodProductRegisterBodySchemaValidation } from '@/infra/validation/zod/zod-register-product-body-schema-validation'
import { ZodProductUpdateBodySchemaValidation } from '@/infra/validation/zod/zod-update-product-body-schema-validation'

import { ProductDeleteController } from '../../controllers/product/delete'
import { FecthProductsController } from '../../controllers/product/fetch-products'
import { GetProductImagesController } from '../../controllers/product/get-image'
import { ProductRegisterController } from '../../controllers/product/register'
import { ProductUpdateController } from '../../controllers/product/update'
import type { HttpServer } from '../../http-server'

export class ProductRoutes {
  constructor(private httpServer: HttpServer) {}

  async init() {
    const isPrivateRoute = true
    const isAdmin = true

    const zodFetchProductsBodySchemaValidation =
      new ZodFetchProductsQuerySchemaValidation()
    const fetchProductsController = new FecthProductsController(
      zodFetchProductsBodySchemaValidation,
    )

    this.httpServer.register(
      'get',
      '/products',
      fetchProductsController.handle.bind(fetchProductsController),
      isPrivateRoute,
      isAdmin,
    )

    const zodRegisterProductBodySchemaValidation =
      new ZodProductRegisterBodySchemaValidation()
    const registerProductController = new ProductRegisterController(
      zodRegisterProductBodySchemaValidation,
    )

    this.httpServer.register(
      'post',
      '/product',
      registerProductController.handle.bind(registerProductController),
      isPrivateRoute,
      isAdmin,
    )

    const zodUpdateProductBodySchemaValidation =
      new ZodProductUpdateBodySchemaValidation()
    const updateProductController = new ProductUpdateController(
      zodUpdateProductBodySchemaValidation,
    )

    this.httpServer.register(
      'put',
      '/product',
      updateProductController.handle.bind(updateProductController),
      isPrivateRoute,
      isAdmin,
    )

    const zodGetProductImagesBodySchemaValidation =
      new ZodGetProductImagesBodySchemaValidation()
    const getproductImagesBodyController = new GetProductImagesController(
      zodGetProductImagesBodySchemaValidation,
    )

    this.httpServer.register(
      'get',
      '/product/:productId/get-image/:isPrincipal/:imageName',
      getproductImagesBodyController.handle.bind(
        getproductImagesBodyController,
      ),
      isPrivateRoute,
      isAdmin,
    )

    const zodProductDeleteBodySchemaValidation =
      new ZodProductDeleteBodySchemaValidation()
    const productDeleteController = new ProductDeleteController(
      this.httpServer,
      zodProductDeleteBodySchemaValidation,
    )

    this.httpServer.register(
      'delete',
      '/product/:productId',
      productDeleteController.handle.bind(productDeleteController),
      isPrivateRoute,
      isAdmin,
    )
  }
}
