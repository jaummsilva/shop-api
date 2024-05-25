import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

const productDeleteBodySchema = z.object({
  productId: z.string().uuid(),
})

// Tipo inferido a partir do esquema Zod
export type ProductDeleteBodySchema = z.infer<typeof productDeleteBodySchema>

// Implementação da validação utilizando o esquema Zod
export class ZodProductDeleteBodySchemaValidation
  implements Validation<ProductDeleteBodySchema>
{
  parse(input: object | undefined) {
    return productDeleteBodySchema.parse(input)
  }
}
