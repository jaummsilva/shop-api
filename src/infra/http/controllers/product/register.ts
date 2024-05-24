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
import { makeProductRegisterUseCase } from './factories/make-register-products-use-case'
import type { ProductRegisterBodyMultiPartsProps } from './interfaces/register-body-multi-parts-props'

export class ProductRegisterController {
  constructor(
    private bodyValidation: Validation<{
      name: string
      description?: string
      price: number
      photoPrincipal: ImagePropsValidation
      photos?: ImagePropsValidation[]
    }>,
  ) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const {
        name,
        description,
        price,
        photoPrincipal,
        photos0,
        photos1,
        photos2,
      } = request.body as ProductRegisterBodyMultiPartsProps

      const nameValue = name.value
      const descriptionValue = description?.value
      const priceValue = Number(price.value)

      const principalImage: ImagePropsValidation = {
        file: { type: photoPrincipal.type },
        filename: photoPrincipal.filename,
        mimetype: photoPrincipal.mimetype,
      }

      const uuid = new UniqueEntityID().toString()
      const imagePrincipalFakeName = `${uuid}.${photoPrincipal.filename.split('.').pop()}`

      const productImages: ProductImages[] = [
        ProductImages.create({
          productId: '', // Será preenchido ao criar o produto
          imageOriginalName: photoPrincipal.filename,
          imageFakeName: imagePrincipalFakeName,
          imageType: photoPrincipal.mimetype,
          isPrincipal: true,
        }),
      ]

      const additionalPhotos: ImagePropsValidation[] = []

      // Filtra e mapeia as fotos adicionais
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
        name: nameValue,
        description: descriptionValue,
        price: priceValue,
        photoPrincipal: principalImage,
        photos: additionalPhotos,
      })

      // Executa o caso de uso para registrar o produto
      const productRegisterUseCase = makeProductRegisterUseCase()
      const result = await productRegisterUseCase.execute({
        name: nameValue,
        price: priceValue,
        description: descriptionValue,
        productImages,
      })

      if (result.isRight()) {
        // Função para salvar a imagem
        const saveImage = async (
          image: ProductImages,
          buffer: Buffer,
          isPrincipal: boolean,
        ) => {
          const productTempDir = path.join(
            PATH_TEMP_FILES,
            result.value.product.id.toString(),
            isPrincipal ? 'principal' : 'optional',
          )
          const pathImage = path.join(productTempDir, image.imageFakeName)

          // Garante que o diretório exista antes de gravar o arquivo
          if (!fs.existsSync(productTempDir)) {
            fs.mkdirSync(productTempDir, { recursive: true })
          }

          fs.writeFileSync(pathImage, buffer)
        }

        // Salva a imagem principal
        let data = await photoPrincipal.toBuffer()
        await saveImage(productImages[0], data, true)

        // Verifica se há imagens adicionais e as salva
        if (additionalPhotos.length > 0) {
          for (let i = 0; i < additionalPhotos.length; i++) {
            if (photos[i]) {
              data = await photos[i]!.toBuffer() // adicionamos ! para indicar que sabemos que photos[i] não é undefined
              await saveImage(productImages[i + 1], data, false)
            }
          }
        }
      }

      return reply.status(201).send()
    } catch (error) {
      // Captura e manipula o erro de validação
      const validationError = fromError(error)
      return reply.status(400).json({
        message: validationError.details,
      })
    }
  }
}
