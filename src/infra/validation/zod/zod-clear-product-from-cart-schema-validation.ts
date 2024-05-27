import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

// Defina o esquema de validação
const clearProductFromCartQuerySchema = z.object({
  productId: z.string().uuid(),
})

// Defina o tipo inferido do esquema de validação
export type ClearProductFromCartQuerySchema = z.infer<
  typeof clearProductFromCartQuerySchema
>

// Implemente a validação
export class ZodClearProductFromCartQuerySchemaValidation
  implements Validation<ClearProductFromCartQuerySchema>
{
  parse(input: object | undefined) {
    return clearProductFromCartQuerySchema.parse(input)
  }
}
