import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

const MB_BYTES = 1000000 // Number of bytes in a megabyte.

// This is the list of mime types you will accept with the schema
const ACCEPTED_MIME_TYPES = ['image/gif', 'image/jpeg', 'image/png']

const userRegisterBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
  role: z.enum(['ADMIN', 'MEMBER']),
  phone: z.string(),
  photoPath: z.instanceof(File).superRefine((f, ctx) => {
    if (!ACCEPTED_MIME_TYPES.includes(f.type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `File must be one of [${ACCEPTED_MIME_TYPES.join(', ')}] but was ${f.type}`,
      })
    }
    if (f.size > 3 * MB_BYTES) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `The file must not be larger than ${3 * MB_BYTES} bytes: ${f.size}`,
      })
    }
  }),
  birthdate: z.string().transform((value) => new Date(value)),
})

export type UserRegisterBodySchema = z.infer<typeof userRegisterBodySchema>

export class ZodUserRegisterBodySchemaValidation
  implements Validation<UserRegisterBodySchema>
{
  parse(input: object | undefined) {
    return userRegisterBodySchema.parse(input)
  }
}
