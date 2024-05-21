import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

// Defina o esquema de validação
const fetchUsersQuerySchema = z.object({
  name: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  perPage: z.enum(['10', '25', '50', '100']).transform(Number).default('10'),
})

// Defina o tipo inferido do esquema de validação
export type FetchUsersuerySchema = z.infer<typeof fetchUsersQuerySchema>

// Implemente a validação
export class ZodFetchUsersQuerySchemaValidation
  implements Validation<FetchUsersuerySchema>
{
  parse(input: object | undefined) {
    return fetchUsersQuerySchema.parse(input)
  }
}
