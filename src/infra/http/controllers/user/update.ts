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
      photoPath?: {
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

      let imageFakeName = ''
      let photoFilename = ''
      let photoMimetype = ''

      const nameValue = name.value
      const userIdValue = userId.value
      const emailValue = email.value
      const passwordValue = password.value
      const roleValue = role.value
      const birthdateValue = birthdate.value
      const phoneValue = phone.value
      const statusValue = status.value

      if (photoPath) {
        photoFilename = photoPath.filename
        photoMimetype = photoPath.mimetype

        // Generate a UUID for the new file name
        const uuid = new UniqueEntityID().toString()
        imageFakeName = `${uuid}.${photoFilename.split('.').pop()}`

        const data = await photoPath.toBuffer()
        const pathImage = path.join(PATH_TEMP_FILES, imageFakeName)

        // Save the new image file
        fs.writeFileSync(pathImage, data)
      }

      this.bodyValidation.parse({
        userId: userIdValue,
        email: emailValue,
        password: passwordValue,
        name: nameValue,
        role: roleValue,
        phone: phoneValue,
        birthdate: birthdateValue,
        status: statusValue,
        photoPath: photoPath
          ? {
              file: {
                type: photoPath.type,
              },
              filename: photoFilename,
              mimetype: photoMimetype,
            }
          : undefined,
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

      return reply.status(204).send()
    } catch (error) {
      const validationError = fromError(error)

      return reply.status(400).json({
        message: validationError.details,
      })
    }
  }
}
