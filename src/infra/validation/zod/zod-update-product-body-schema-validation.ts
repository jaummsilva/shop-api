import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

// Definição do esquema Zod para o corpo de registro de usuário
const productUpdateBodySchema = z.object({
  productId: z.string().uuid(),
  name: z.string().min(3),
  description: z.string().optional(),
  price: z.number(),
  photoPrincipal: z
    .object({
      file: z.object({
        type: z.string(),
      }),
      filename: z.string(),
      mimetype: z.string(),
    })
    .refine(({ mimetype }) => {
      // Check file type
      const allowedTypes = ['image/png', 'image/jpeg']
      if (!allowedTypes.includes(mimetype)) {
        throw new Error('Only PNG and JPEG files are allowed.')
      }

      return true // Return true if file passes all checks
    })
    .optional(),
  photos: z.array(
    z
      .object({
        file: z.object({
          type: z.string(),
        }),
        filename: z.string(),
        mimetype: z.string(),
      })
      .refine(({ mimetype }) => {
        // Check file type
        const allowedTypes = ['image/png', 'image/jpeg']
        if (!allowedTypes.includes(mimetype)) {
          throw new Error('Only PNG and JPEG files are allowed.')
        }

        return true
      })
      .optional(),
  ),
})

// Tipo inferido a partir do esquema Zod
export type ProductUpdateBodySchema = z.infer<typeof productUpdateBodySchema>

// Implementação da validação utilizando o esquema Zod
export class ZodProductUpdateBodySchemaValidation
  implements Validation<ProductUpdateBodySchema>
{
  parse(input: object | undefined) {
    return productUpdateBodySchema.parse(input)
  }
}
