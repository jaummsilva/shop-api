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
      photoPath: string
    }>,
  ) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const { name, email, password, role, birthdate, phone, photoPath } =
        request.body

      const { value: nameValue } = name
      const { value: emailValue } = email
      const { value: passwordValue } = password
      const { value: roleValue } = role
      const { value: birthdateValue } = birthdate
      const { value: phoneValue } = phone

      const { filename: photoFilename, mimetype: photoMimetype } = photoPath

      // Gere um UUID para o novo nome do arquivo
      const uuid = new UniqueEntityID()
      const fileExtension = path.extname(photoFilename)
      const destinationPath = `src/temp/${uuid}${fileExtension}`
      // Parse the body using bodyValidation
      this.bodyValidation.parse({
        email: emailValue,
        password: passwordValue,
        name: nameValue,
        role: roleValue,
        phone: phoneValue,
        birthdate: birthdateValue,
        photoPath: {
          file: {
            type: photoPath.type,
          },
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
        photoPath: destinationPath,
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
      fs.writeFileSync(destinationPath, data)

      return reply.status(201).send()
    } catch (error) {
      const validationError = fromError(error)

      return reply.status(400).json({
        message: validationError.details,
      })
    }
  }
}
