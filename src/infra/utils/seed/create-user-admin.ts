import { hash } from 'bcryptjs'

import { prisma } from '@/infra/database/prisma/prisma'

export async function seed() {
  const passwordHash = await hash('123456', 10)

  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'teste@gmail.com',
      passwordHash,
      role: 'ADMIN',
    },
  })
}
