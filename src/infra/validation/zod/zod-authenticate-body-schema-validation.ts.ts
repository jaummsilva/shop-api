import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

export class ZodAuthenticateBodySchemaValidation
  implements Validation<AuthenticateBodySchema>
{
  parse(input: object | undefined) {
    return authenticateBodySchema.parse(input)
  }
}
