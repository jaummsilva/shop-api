import fs from 'fs'
import path from 'path'
import { fromError } from 'zod-validation-error'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Validation } from '@/core/validation/validation'
import { UserAlreadyExistsError } from '@/domain/application/use-cases/errors/user/user-already-exists'
import { PATH_TEMP_FILES } from '@/paths'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import { makeUpdateProfileUseCase } from './factories/make-update-profile-use-case'
import type { UpdateProfileBodyMultiPartsProps } from './interfaces/update-profile-multi-parts-props'

export class UpdateProfileController {
  constructor(
    private bodyValidation: Validation<{
      email: string
      password: string | ''
      name: string
      phone: string
      birthdate: Date
      photoPath?: {
        file: {
          type: string
        }
        filename: string
        mimetype: string
      }
    }>,
  ) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const { name, email, password, photoPath, birthdate, phone } =
        request.body as UpdateProfileBodyMultiPartsProps

      const nameValue = name.value
      const emailValue = email.value
      const passwordValue = password.value
      const birthdateValue = birthdate.value
      const phoneValue = phone.value

      let imageFakeName = ''
      let photoFilename = ''
      let photoMimetype = ''

      if (photoPath) {
        photoFilename = photoPath.filename
        photoMimetype = photoPath.mimetype

        // Generate a UUID for the new file name
        const uuid = new UniqueEntityID().toString()
        imageFakeName = `${uuid}.${photoFilename.split('.').pop()}`
      }

      this.bodyValidation.parse({
        email: emailValue,
        password: passwordValue,
        name: nameValue,
        phone: phoneValue,
        birthdate: birthdateValue,
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

      const userUpdateUsersCase = makeUpdateProfileUseCase()

      const result = await userUpdateUsersCase.execute({
        userId: request.user.sub,
        name: nameValue,
        email: emailValue,
        password: passwordValue,
        imageFakeName,
        imageOriginalName: photoFilename,
        imageType: photoMimetype,
        birthdate: birthdateValue,
        phone: phoneValue,
      })

      if (result.isLeft()) {
        const error = result.value

        if (error instanceof UserAlreadyExistsError) {
          return reply.status(409).json({
            message: error.message,
          })
        }
      }

      // Check if a new photo is provided
      if (photoPath) {
        // Read photo data
        const data = await photoPath.toBuffer()
        const userTempDir = path.join(PATH_TEMP_FILES, request.user.sub)
        if (fs.existsSync(userTempDir)) {
          fs.readdirSync(userTempDir).forEach((file) => {
            const filePath = path.join(userTempDir, file)
            fs.unlinkSync(filePath)
          })
        } else {
          fs.mkdirSync(userTempDir, { recursive: true })
        }

        // Save the new image file
        const pathImage = path.join(userTempDir, imageFakeName)
        fs.writeFileSync(pathImage, data)
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
