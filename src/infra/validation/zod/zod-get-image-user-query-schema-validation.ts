import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

// Definição do esquema Zod para o corpo de registro de usuário
const getImageUserBodySchema = z.object({
  imageName: z.string(),
})

// Tipo inferido a partir do esquema Zod
export type GetImageUserBodySchema = z.infer<typeof getImageUserBodySchema>

// Implementação da validação utilizando o esquema Zod
export class ZodGetImageUserBodySchemaValidation
  implements Validation<GetImageUserBodySchema>
{
  parse(input: object | undefined) {
    return getImageUserBodySchema.parse(input)
  }
}
