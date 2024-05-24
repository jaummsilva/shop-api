import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

// Defina o esquema de validação
const fetchProductsQuerySchema = z.object({
  name: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  perPage: z.enum(['10', '25', '50', '100']).transform(Number).default('10'),
})

// Defina o tipo inferido do esquema de validação
export type FetchProductsQuerySchema = z.infer<typeof fetchProductsQuerySchema>

// Implemente a validação
export class ZodFetchProductsQuerySchemaValidation
  implements Validation<FetchProductsQuerySchema>
{
  parse(input: object | undefined) {
    return fetchProductsQuerySchema.parse(input)
  }
}
