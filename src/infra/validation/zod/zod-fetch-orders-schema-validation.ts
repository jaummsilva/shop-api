import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

// Defina o esquema de validação
const fetchOrdersQuerySchema = z.object({
  query: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  perPage: z.enum(['10', '25', '50', '100']).transform(Number).default('10'),
})

// Defina o tipo inferido do esquema de validação
export type FetchOrdersQuerySchema = z.infer<typeof fetchOrdersQuerySchema>

// Implemente a validação
export class ZodFetchOrdersQuerySchemaValidation
  implements Validation<FetchOrdersQuerySchema>
{
  parse(input: object | undefined) {
    return fetchOrdersQuerySchema.parse(input)
  }
}
