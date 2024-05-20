import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

const userRegisterBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
  role: z.enum(['ADMIN', 'MEMBER']),
})

export type UserRegisterBodySchema = z.infer<typeof userRegisterBodySchema>

export class ZodUserRegisterBodySchemaValidation
  implements Validation<UserRegisterBodySchema>
{
  parse(input: object | undefined) {
    return userRegisterBodySchema.parse(input)
  }
}
