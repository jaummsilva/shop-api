import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

const userUpdateBodySchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  password: z
    .string()
    .refine(
      (value) =>
        value.length === 0 ||
        (value.length >= 6 && value.trim().length === value.length),
      {
        message: 'Password must be at least 6 characters long.',
      },
    ),
  name: z.string(),
  role: z.enum(['ADMIN', 'MEMBER']),
  status: z.enum(['S', 'N']),
  phone: z.string(),
  photoPath: z
    .object({
      file: z.object({
        type: z.string(), // type is required
      }),
      filename: z.string(), // filename is required
      mimetype: z.string(), // mimetype is required
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
export type UserUpdateBodySchema = z.infer<typeof userUpdateBodySchema>

// Implementação da validação utilizando o esquema Zod
export class ZodUserUpdateBodySchemaValidation
  implements Validation<UserUpdateBodySchema>
{
  parse(input: object | undefined) {
    return userUpdateBodySchema.parse(input)
  }
}
