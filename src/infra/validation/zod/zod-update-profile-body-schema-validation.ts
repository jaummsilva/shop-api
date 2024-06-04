import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

const updateProfileBodySchema = z.object({
  email: z.string().email().max(255),
  birthdate: z.string().transform((value) => new Date(value)),
  phone: z.string().max(15),
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

      return true
    })
    .optional(),
})

export type UpdateProfileBodySchema = z.infer<typeof updateProfileBodySchema>

export class ZodUpdateProfileBodySchemaValidation
  implements Validation<UpdateProfileBodySchema>
{
  parse(input: object | undefined) {
    return updateProfileBodySchema.parse(input)
  }
}
