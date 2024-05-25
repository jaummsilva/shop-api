import fs from 'fs'
import path from 'path'
import { fromError } from 'zod-validation-error'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { ImagePropsValidation } from '@/core/types/validate-image'
import type { Validation } from '@/core/validation/validation'
import { ProductImages } from '@/domain/enterprise/product-image'
import { PATH_TEMP_FILES } from '@/paths'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import { makeProductUpdateUseCase } from './factories/make-update-products-use-case'
import type { ProductUpdateBodyMultiPartsProps } from './interfaces/update-body-multi-parts-props'

export class ProductUpdateController {
  constructor(
    private bodyValidation: Validation<{
      productId: string
      name: string
      description?: string
      price: number
      photoPrincipal?: ImagePropsValidation
      photos?: ImagePropsValidation[]
    }>,
  ) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const {
        productId,
        name,
        description,
        price,
        photoPrincipal,
        photos0,
        photos1,
        photos2,
      } = request.body as ProductUpdateBodyMultiPartsProps

      const productIdValue = productId.value
      const nameValue = name.value
      const descriptionValue = description?.value
      const priceValue = Number(price.value)

      const productImages: ProductImages[] = []
      let principalImage: ImagePropsValidation | undefined

      if (photoPrincipal) {
        principalImage = {
          file: { type: photoPrincipal.type },
          filename: photoPrincipal.filename,
          mimetype: photoPrincipal.mimetype,
        }
        const uuid = new UniqueEntityID().toString()
        const imagePrincipalFakeName = `${uuid}.${photoPrincipal.filename.split('.').pop()}`

        productImages.push(
          ProductImages.create({
            productId: '', // Será preenchido ao criar o produto
            imageOriginalName: photoPrincipal.filename,
            imageFakeName: imagePrincipalFakeName,
            imageType: photoPrincipal.mimetype,
            isPrincipal: true,
          }),
        )
      }

      const additionalPhotos: ImagePropsValidation[] = []
      const photos = [photos0, photos1, photos2].filter((photo) => !!photo)

      photos.forEach((photo) => {
        if (photo) {
          additionalPhotos.push({
            file: { type: photo.type },
            filename: photo.filename,
            mimetype: photo.mimetype,
          })
          const uuid = new UniqueEntityID().toString()
          const imageFakeName = `${uuid}.${photo.filename.split('.').pop()}`
          productImages.push(
            ProductImages.create({
              productId: '', // Será preenchido ao criar o produto
              imageOriginalName: photo.filename,
              imageFakeName,
              imageType: photo.mimetype,
              isPrincipal: false,
            }),
          )
        }
      })

      // Realiza a validação dos dados
      this.bodyValidation.parse({
        productId: productIdValue,
        name: nameValue,
        description: descriptionValue,
        price: priceValue,
        photoPrincipal: principalImage,
        photos: additionalPhotos,
      })

      // Executa o caso de uso para registrar o produto
      const productUpdateUseCase = makeProductUpdateUseCase()
      const result = await productUpdateUseCase.execute({
        productId: productIdValue,
        name: nameValue,
        price: priceValue,
        description: descriptionValue,
        productImages,
      })

      if (result.isRight()) {
        const productId = result.value.product.id.toString()

        // Função para remover imagens antigas
        const removeOldImages = (directory: string) => {
          if (fs.existsSync(directory)) {
            fs.readdirSync(directory).forEach((file) => {
              fs.unlinkSync(path.join(directory, file))
            })
          }
        }

        // Função para salvar a imagem
        const saveImage = async (
          image: ProductImages,
          buffer: Buffer,
          isPrincipal: boolean,
        ) => {
          const productTempDir = path.join(
            PATH_TEMP_FILES,
            productId,
            isPrincipal ? 'principal' : 'optional',
          )
          const pathImage = path.join(productTempDir, image.imageFakeName)

          // Garante que o diretório exista antes de gravar o arquivo
          if (!fs.existsSync(productTempDir)) {
            fs.mkdirSync(productTempDir, { recursive: true })
          }

          fs.writeFileSync(pathImage, buffer)
        }

        // Remover e salvar a imagem principal
        if (principalImage) {
          const principalDir = path.join(
            PATH_TEMP_FILES,
            productId,
            'principal',
          )
          removeOldImages(principalDir)
          const data = await photoPrincipal!.toBuffer()
          await saveImage(productImages[0], data, true)
        }

        // Remover e salvar imagens adicionais
        if (additionalPhotos.length > 0) {
          const optionalDir = path.join(PATH_TEMP_FILES, productId, 'optional')
          removeOldImages(optionalDir)
          for (let i = 0; i < additionalPhotos.length; i++) {
            if (photos[i]) {
              const data = await photos[i]!.toBuffer()
              await saveImage(productImages[i], data, false)
            }
          }
        }
      }
      return reply.status(204).send()
    } catch (error) {
      // Captura e manipula o erro de validação
      const validationError = fromError(error)
      return reply.status(400).json({
        message: validationError.details,
      })
    }
  }
}
