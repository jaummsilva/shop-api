import type { UsersRepository } from "@/domain/application/repositories/users-repository'"
import type { User } from '@/domain/enterprise/user'
import { prisma } from '@/infra/database/prisma/prisma'

import { PrismaUserMapper } from '../../mappers/prisma-user-mapper'

export class PrismaUsersRepository implements UsersRepository {
  async create(data: User) {
    const user = await prisma.user.create({
      data: {
        role: data.role,
        email: data.email,
        name: data.name,
        password_hash: data.password_hash,
        created_at: data.created_at,
        id: data.id.toString(),
      },
    })
    return PrismaUserMapper.toDomain(user)
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    if (!user) {
      return null
    }
    return PrismaUserMapper.toDomain(user)
  }

  async findById(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })
    if (!user) {
      return null
    }
    return PrismaUserMapper.toDomain(user)
  }

  async findByEmailAndExcludeId(email: string, excludeId: string) {
    const user = await prisma.user.findFirst({
      where: {
        email,
        id: { not: excludeId },
      },
    })
    return user ? PrismaUserMapper.toDomain(user) : null
  }

  async update(data: User) {
    const user = await prisma.user.update({
      where: {
        id: data.id.toString(),
      },
      data: {
        email: data.email,
        name: data.name,
        password_hash: data.password_hash,
      },
    })
    return PrismaUserMapper.toDomain(user)
  }
}
