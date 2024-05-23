import fs from 'fs'
import path from 'path'
import { fromError } from 'zod-validation-error'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Validation } from '@/core/validation/validation'
import { UserAlreadyExistsError } from '@/domain/application/use-cases/errors/user/user-already-exists'
import { PATH_TEMP_FILES } from '@/paths'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import type { HttpServer } from '../../http-server'
import { makeUdateUseCase } from './factories/make-update-use-case'
import type { UpdateBodyMultiPartsProps } from './interfaces/update-body-multi-parts-props'

export class UserUpdateController {
  constructor(
    private httpServer: HttpServer,
    private bodyValidation: Validation<{
      userId: string
      email: string
      password: string | ''
      name: string
      role: 'ADMIN' | 'MEMBER'
      phone: string
      birthdate: Date
      photoPath: {
        file: {
          type: string
        }
        filename: string
        mimetype: string
      }
      status: 'S' | 'N'
    }>,
  ) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const {
        name,
        email,
        password,
        role,
        birthdate,
        phone,
        photoPath,
        userId,
        status,
      } = request.body as UpdateBodyMultiPartsProps

      const nameValue = name.value
      const userIdValue = userId.value
      const emailValue = email.value
      const passwordValue = password.value
      const roleValue = role.value
      const birthdateValue = birthdate.value
      const phoneValue = phone.value
      const statusValue = status.value
      const { filename: photoFilename, mimetype: photoMimetype } = photoPath

      // Gere um UUID para o novo nome do arquivo
      const uuid = new UniqueEntityID().toString()
      const imageFakeName = `${uuid}.${photoFilename.split('.').pop()}`

      this.bodyValidation.parse({
        userId: userIdValue,
        email: emailValue,
        password: passwordValue,
        name: nameValue,
        role: roleValue,
        phone: phoneValue,
        birthdate: birthdateValue,
        status: statusValue,
        photoPath: {
          file: {
            type: photoPath.type,
          },
          filename: photoFilename,
          mimetype: photoMimetype,
        },
      })

      const userUpdateUsersCase = makeUdateUseCase()

      const result = await userUpdateUsersCase.execute({
        userId: userIdValue,
        name: nameValue,
        email: emailValue,
        password: passwordValue,
        role: roleValue,
        birthdate: birthdateValue,
        phone: phoneValue,
        imageFakeName,
        imageOriginalName: photoFilename,
        status: statusValue,
        imageType: photoMimetype,
      })

      if (result.isLeft()) {
        const error = result.value

        if (error instanceof UserAlreadyExistsError) {
          return reply.status(409).json({
            message: error.message,
          })
        }
      }

      const data = await photoPath.toBuffer()
      const pathImage = path.join(PATH_TEMP_FILES, imageFakeName)

      // Verifica se a imagem original é diferente da que está sendo enviada
      const shouldDeleteExistingPhoto = photoFilename !== imageFakeName

      if (shouldDeleteExistingPhoto) {
        // Deleta a foto existente a partir do imageFakeName da pasta temp
        const existingImagePath = path.join(PATH_TEMP_FILES, photoFilename)
        if (fs.existsSync(existingImagePath)) {
          fs.unlinkSync(existingImagePath)
        }
      }

      fs.writeFileSync(pathImage, data)

      return reply.status(201).send()
    } catch (error) {
      const validationError = fromError(error)

      return reply.status(400).json({
        message: validationError.details,
      })
    }
  }
}
