import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

// Defina o esquema de validação
const getProductQuerySchema = z.object({
  productId: z.string().uuid(),
})

// Defina o tipo inferido do esquema de validação
export type GetProductQuerySchema = z.infer<typeof getProductQuerySchema>

// Implemente a validação
export class ZodGetProductQuerySchemaValidation
  implements Validation<GetProductQuerySchema>
{
  parse(input: object | undefined) {
    return getProductQuerySchema.parse(input)
  }
}
