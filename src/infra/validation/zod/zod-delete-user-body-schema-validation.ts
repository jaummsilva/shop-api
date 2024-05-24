import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

const userDeleteBodySchema = z.object({
  userId: z.string().uuid(),
})

// Tipo inferido a partir do esquema Zod
export type UserDeleteBodySchema = z.infer<typeof userDeleteBodySchema>

// Implementação da validação utilizando o esquema Zod
export class ZodUserDeleteBodySchemaValidation
  implements Validation<UserDeleteBodySchema>
{
  parse(input: object | undefined) {
    return userDeleteBodySchema.parse(input)
  }
}
