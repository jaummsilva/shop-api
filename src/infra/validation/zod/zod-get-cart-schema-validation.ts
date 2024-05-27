import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

// Defina o esquema de validação
const getCartQuerySchema = z.object({
  userId: z.string().uuid(),
})

// Defina o tipo inferido do esquema de validação
export type GetCartQuerySchema = z.infer<typeof getCartQuerySchema>

// Implemente a validação
export class ZodGetCartQuerySchemaValidation
  implements Validation<GetCartQuerySchema>
{
  parse(input: object | undefined) {
    return getCartQuerySchema.parse(input)
  }
}
