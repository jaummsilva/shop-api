import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

const userStatusUpdateBodySchema = z.object({
  userId: z.string().uuid(),
  status: z.enum(['S', 'N']),
})

// Tipo inferido a partir do esquema Zod
export type UserStatusUpdateBodySchema = z.infer<
  typeof userStatusUpdateBodySchema
>

// Implementação da validação utilizando o esquema Zod
export class ZodUserStatusUpdateBodySchemaValidation
  implements Validation<UserStatusUpdateBodySchema>
{
  parse(input: object | undefined) {
    return userStatusUpdateBodySchema.parse(input)
  }
}
