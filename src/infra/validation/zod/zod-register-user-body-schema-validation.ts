import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

// Definição do esquema Zod para o corpo de registro de usuário
const userRegisterBodySchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(6).max(100),
  name: z.string().min(3).max(255),
  role: z.enum(['ADMIN', 'MEMBER']),
  phone: z.string().max(15),
  photoPath: z
    .object({
      file: z.object({
        type: z.string(),
      }),
      filename: z.string(),
      mimetype: z.string(),
    })
    .refine(({ mimetype }) => {
      // Check file type
      const allowedTypes = ['image/png', 'image/jpeg']
      if (!allowedTypes.includes(mimetype)) {
        throw new Error('Only PNG and JPEG files are allowed.')
      }

      return true // Return true if file passes all checks
    })
    .refine(({ file }) => !!file, {
      message: 'Photo is required.',
    }),
  birthdate: z.string().transform((value) => new Date(value)),
})

// Tipo inferido a partir do esquema Zod
export type UserRegisterBodySchema = z.infer<typeof userRegisterBodySchema>

// Implementação da validação utilizando o esquema Zod
export class ZodUserRegisterBodySchemaValidation
  implements Validation<UserRegisterBodySchema>
{
  parse(input: object | undefined) {
    return userRegisterBodySchema.parse(input)
  }
}
