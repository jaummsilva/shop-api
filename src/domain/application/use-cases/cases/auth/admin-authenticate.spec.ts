import { HashAdapter } from 'test/cryptography/hash-adapter'
import { InMemoryUsersRepository } from 'test/repositories/in-memory/user/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import type { HashComparer } from '@/core/cryptography/hash-comparer'
import type { HashGenerator } from '@/core/cryptography/hash-generator'
import { User } from '@/domain/enterprise/user'

import { UserNotExistsError } from '../../errors/user/user-not-exists'
import { AdminAuthenticateUseCase } from './admin-authenticate'

let inMemoryUsersRepository: InMemoryUsersRepository
let adminAuthenticateUseCase: AdminAuthenticateUseCase
let hashComparer: HashComparer
let hashGenerator: HashGenerator

describe('Admin Authenticate Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository() // Fixed typo
    hashComparer = new HashAdapter()
    hashGenerator = new HashAdapter()
    adminAuthenticateUseCase = new AdminAuthenticateUseCase(
      inMemoryUsersRepository,
      hashComparer,
    )
  })

  it('should be able to authenticate', async () => {
    await inMemoryUsersRepository.create(
      User.create({
        name: 'teste',
        email: 'teste@gmail.com',
        passwordHash: await hashGenerator.hash('TESTE123'),
        role: 'ADMIN',
        phone: '123456789',
        photoPath: '/path/to/photo.jpg',
        birthdate: new Date('1990-01-01'),
      }),
    )

    await inMemoryUsersRepository.create(
      User.create({
        name: 'teste',
        email: 'teste2@gmail.com',
        passwordHash: await hashGenerator.hash('TESTE123'),
        role: 'MEMBER',
        phone: '123456789',
        photoPath: '/path/to/photo.jpg',
        birthdate: new Date('1990-01-01'),
      }),
    )

    const result = await adminAuthenticateUseCase.execute({
      email: 'teste@gmail.com',
      password: 'TESTE123',
    })

    expect(result.isRight() && result.value.user.id.toString()).toEqual(
      expect.any(String),
    )
  })

  it('should not  be able to authenticate with wrong email', async () => {
    const result = adminAuthenticateUseCase.execute({
      email: 'teste.1@gmail.com',
      password: 'TESTE123',
    })

    expect((await result).isLeft() && (await result).value).toBeInstanceOf(
      UserNotExistsError,
    )
  })

  it('should not  be able to authenticate with wrong password', async () => {
    await inMemoryUsersRepository.create(
      User.create({
        name: 'teste',
        email: 'teste5@gmail.com',
        passwordHash: await hashGenerator.hash('TESTE123'),
        role: 'ADMIN',
        phone: '123456789',
        photoPath: '/path/to/photo.jpg',
        birthdate: new Date('1990-01-01'),
      }),
    )

    const duplicateRegistrationResult = await adminAuthenticateUseCase.execute({
      email: 'teste5@gmail.com',
      password: 'TESTE123312',
    })

    expect(
      duplicateRegistrationResult.isLeft() && duplicateRegistrationResult.value,
    ).toBeInstanceOf(UserNotExistsError)
  })

  it('should be able to authenticate', async () => {
    await inMemoryUsersRepository.create(
      User.create({
        name: 'teste',
        email: 'teste@gmail.com',
        passwordHash: await hashGenerator.hash('TESTE123'),
        role: 'ADMIN',
        phone: '123456789',
        photoPath: '/path/to/photo.jpg',
        birthdate: new Date('1990-01-01'),
      }),
    )

    await inMemoryUsersRepository.create(
      User.create({
        name: 'teste',
        email: 'teste2@gmail.com',
        passwordHash: await hashGenerator.hash('TESTE123'),
        role: 'MEMBER',
        phone: '123456789',
        photoPath: '/path/to/photo.jpg',
        birthdate: new Date('1990-01-01'),
      }),
    )

    const result = await adminAuthenticateUseCase.execute({
      email: 'teste2@gmail.com',
      password: 'TESTE123',
    })

    expect(result.isLeft()).toBeTruthy()
  })
})
