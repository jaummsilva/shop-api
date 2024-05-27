import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

// Defina o esquema de validação
const fetchStoreProductsQuerySchema = z.object({
  query: z.string().optional(),
})

// Defina o tipo inferido do esquema de validação
export type FetchStoreProductsQuerySchema = z.infer<
  typeof fetchStoreProductsQuerySchema
>

// Implemente a validação
export class ZodFetchStoreProductsQuerySchemaValidation
  implements Validation<FetchStoreProductsQuerySchema>
{
  parse(input: object | undefined) {
    return fetchStoreProductsQuerySchema.parse(input)
  }
}
