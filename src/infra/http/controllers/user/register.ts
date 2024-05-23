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
import { makeRegisterUseCase } from './factories/make-register-use-case'
import type { RegisterBodyMultiPartsProps } from './interfaces/register-body-multi-parts-props'

export class UserController {
  constructor(
    private httpServer: HttpServer,
    private bodyValidation: Validation<{
      email: string
      password: string
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
    }>,
  ) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const { name, email, password, role, birthdate, phone, photoPath } =
        request.body as RegisterBodyMultiPartsProps

      // Extrair valores dos campos de request.body
      const nameValue = name.value
      const emailValue = email.value
      const passwordValue = password.value
      const roleValue = role.value
      const birthdateValue = birthdate.value
      const phoneValue = phone.value

      const { filename: photoFilename, mimetype: photoMimetype } = photoPath

      // Gere um UUID para o novo nome do arquivo
      const uuid = new UniqueEntityID().toString()
      const imageFakeName = `${uuid}.${photoFilename.split('.').pop()}`
      // Parse the body using bodyValidation
      this.bodyValidation.parse({
        email: emailValue,
        password: passwordValue,
        name: nameValue,
        role: roleValue,
        phone: phoneValue,
        birthdate: birthdateValue,
        photoPath: {
          file: { type: photoPath.type },
          filename: photoFilename,
          mimetype: photoMimetype,
        },
      })

      const userRegisterUsersCase = makeRegisterUseCase()
      const result = await userRegisterUsersCase.execute({
        name: nameValue,
        email: emailValue,
        password: passwordValue,
        role: roleValue,
        birthdate: birthdateValue,
        phone: phoneValue,
        imageFakeName,
        imageOriginalName: photoFilename,
        imageType: photoMimetype,
      })

      if (result.isLeft() && result.value instanceof UserAlreadyExistsError) {
        return reply.status(409).json({ message: result.value.message })
      }

      const data = await photoPath.toBuffer()
      const pathImage = path.join(PATH_TEMP_FILES, imageFakeName)
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
