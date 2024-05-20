import type { User as PrismaUser } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User as DomainUser } from '@/domain/enterprise/user'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): DomainUser {
    return DomainUser.create(
      {
        email: raw.email,
        password_hash: raw.password_hash,
        name: raw.name,
        created_at: raw.created_at,
        role: raw.role,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(user: DomainUser): PrismaUser {
    return {
      id: user.id.toString(),
      email: user.email,
      password_hash: user.password_hash,
      name: user.name,
      created_at: user.created_at ?? new Date(),
      role: user.role,
    }
  }
}
