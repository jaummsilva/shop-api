import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

const userUpdateBodySchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email().max(255),
  password: z
    .string()
    .refine(
      (value) =>
        value.length === 0 ||
        (value.length >= 6 &&
          value.length <= 100 &&
          value.trim().length === value.length),
      {
        message:
          'Password must be between 6 and 100 characters long, and should not contain leading or trailing spaces.',
      },
    ),
  name: z.string().min(3).max(255),
  role: z.enum(['ADMIN', 'MEMBER']),
  status: z.enum(['S', 'N']),
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
    .optional(),
  birthdate: z.string().transform((value) => new Date(value)),
})

// Tipo inferido a partir do esquema Zod
export type UserUpdateBodySchema = z.infer<typeof userUpdateBodySchema>

// Implementação da validação utilizando o esquema Zod
export class ZodUserUpdateBodySchemaValidation
  implements Validation<UserUpdateBodySchema>
{
  parse(input: object | undefined) {
    return userUpdateBodySchema.parse(input)
  }
}
