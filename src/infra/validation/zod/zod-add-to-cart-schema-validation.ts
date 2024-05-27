import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

// Defina o esquema de validação
const addToCartQuerySchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number(),
})

// Defina o tipo inferido do esquema de validação
export type AddToCartQuerySchema = z.infer<typeof addToCartQuerySchema>

// Implemente a validação
export class ZodAddToCartQuerySchemaValidation
  implements Validation<AddToCartQuerySchema>
{
  parse(input: object | undefined) {
    return addToCartQuerySchema.parse(input)
  }
}
