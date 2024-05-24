import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

// Definição do esquema Zod para o corpo de registro de usuário
const getproductImagesBodySchema = z.object({
  imageName: z.string(),
  isPrincipal: z.enum(['optional', 'principal']),
  productId: z.string().uuid(),
})

// Tipo inferido a partir do esquema Zod
export type GetProductImagesBodySchema = z.infer<
  typeof getproductImagesBodySchema
>

// Implementação da validação utilizando o esquema Zod
export class ZodGetProductImagesBodySchemaValidation
  implements Validation<GetProductImagesBodySchema>
{
  parse(input: object | undefined) {
    return getproductImagesBodySchema.parse(input)
  }
}
