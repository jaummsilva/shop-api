import type {
  FindManyParams,
  UsersRepository,
} from "@/domain/application/repositories/users-repository'"
import type { MetaResponse } from '@/domain/application/utils/meta-response'
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
        passwordHash: data.passwordHash,
        createdAt: data.createdAt,
        phone: data.phone,
        photoPath: data.photoPath,
        birthdate: data.birthdate,
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
        passwordHash: data.passwordHash,
      },
    })
    return PrismaUserMapper.toDomain(user)
  }

  async findMany(params: FindManyParams) {
    const { name = '', page = 1 } = params

    const skip = (page - 1) * 10
    const take = 10

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: {
          OR: [
            {
              name: {
                contains: name,
                mode: 'insensitive',
              },
            },
          ],
        },
        skip,
        take,
      }),
      prisma.user.count({
        where: {
          OR: [
            {
              name: {
                contains: name,
                mode: 'insensitive',
              },
            },
          ],
        },
      }),
    ])

    const meta: MetaResponse = {
      pageIndex: page || 1,
      perPage: 10,
      totalCount,
    }

    const usersMapped = users.map((user) =>
      PrismaUserMapper.toDomain({
        ...user,
      }),
    )
    return { users: usersMapped, meta }
  }
}
