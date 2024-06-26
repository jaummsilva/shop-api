import 'dotenv/config'

import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string().url(),
  FRONTEND_URL: z.string().url(),
  EMAIL_SERVICE: z.string(),
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.coerce.number().default(465),
  EMAIL_USER: z.string().email(),
  EMAIL_PASS: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables.', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
