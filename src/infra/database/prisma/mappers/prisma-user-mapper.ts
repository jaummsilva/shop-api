import type { User as PrismaUser } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User as DomainUser } from '@/domain/enterprise/user'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): DomainUser {
    return DomainUser.create(
      {
        email: raw.email,
        passwordHash: raw.passwordHash,
        name: raw.name,
        createdAt: raw.createdAt,
        role: raw.role,
        birthdate: raw.birthdate,
        phone: raw.phone,
        imageFakeName: raw.imageFakeName,
        imageOriginalName: raw.imageOriginalName,
        updatedAt: raw.updatedAt,
        status: raw.status,
        imageType: raw.imageType,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(user: DomainUser): PrismaUser {
    return {
      id: user.id.toString(),
      email: user.email,
      passwordHash: user.passwordHash,
      name: user.name,
      createdAt: user.createdAt ?? new Date(),
      role: user.role,
      birthdate: user.birthdate,
      phone: user.phone,
      imageFakeName: user.imageFakeName,
      imageOriginalName: user.imageOriginalName,
      imageType: user.imageType,
      updatedAt: user.updatedAt || new Date(),
      status: user.status || 'S',
    }
  }
}
