import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

// Definição do esquema Zod para o corpo de registro de usuário
const updateProductQuantityInCartBodySchema = z.object({
  productId: z.string().uuid(),
  type: z.enum(['DECREMENT', 'INCREMENT']),
})

export type UpdateProductQuantityInCartBodySchema = z.infer<
  typeof updateProductQuantityInCartBodySchema
>

// Implementação da validação utilizando o esquema Zod
export class ZodUpdateProductQuantityInCartBodySchemaValidation
  implements Validation<UpdateProductQuantityInCartBodySchema>
{
  parse(input: object | undefined) {
    return updateProductQuantityInCartBodySchema.parse(input)
  }
}
