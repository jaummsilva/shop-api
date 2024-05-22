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
      photoPath: string
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
      } = request.body

      const { value: nameValue } = name
      const { value: userIdValue } = userId
      const { value: emailValue } = email
      const { value: passwordValue } = password
      const { value: roleValue } = role
      const { value: birthdateValue } = birthdate
      const { value: phoneValue } = phone
      const { value: statusValue } = status

      const { filename: photoFilename, mimetype: photoMimetype } = photoPath

      // Gere um UUID para o novo nome do arquivo
      const uuid = new UniqueEntityID().toString()
      const destinationPath = `${uuid}.${photoFilename.split('.').pop()}` // Ensure correct file extension

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
        imageFakeName: destinationPath,
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
      const path2 = path.join(PATH_TEMP_FILES, destinationPath)
      fs.writeFileSync(path2, data)

      return reply.status(201).send()
    } catch (error) {
      const validationError = fromError(error)

      return reply.status(400).json({
        message: validationError.details,
      })
    }
  }
}
