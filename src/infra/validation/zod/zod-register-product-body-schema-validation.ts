import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

// Definição do esquema Zod para o corpo de registro de usuário
const productRegisterBodySchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().max(255).optional(),
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
    .refine(({ file }) => !!file, {
      message: 'Photo is required.',
    }),
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
export type ProductRegisterBodySchema = z.infer<
  typeof productRegisterBodySchema
>

// Implementação da validação utilizando o esquema Zod
export class ZodProductRegisterBodySchemaValidation
  implements Validation<ProductRegisterBodySchema>
{
  parse(input: object | undefined) {
    return productRegisterBodySchema.parse(input)
  }
}
