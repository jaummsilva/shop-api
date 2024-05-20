import { HashAdapter } from 'test/cryptography/hash-adapter'
import { InMemoryUsersRepository } from 'test/repositories/in-memory/user/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import type { HashComparer } from '@/core/cryptography/hash-comparer'
import type { HashGenerator } from '@/core/cryptography/hash-generator'
import { User } from '@/domain/enterprise/user'

import { UserNotExistsError } from '../../errors/user/user-not-exists'
import { AuthenticateUseCase } from './authenticate'

let inMemoryUsersRepository: InMemoryUsersRepository
let authenticateUseCase: AuthenticateUseCase
let hashComparer: HashComparer
let hashGenerator: HashGenerator

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository() // Fixed typo
    hashComparer = new HashAdapter()
    hashGenerator = new HashAdapter()
    authenticateUseCase = new AuthenticateUseCase(
      inMemoryUsersRepository,
      hashComparer,
    )
  })

  it('should be able to authenticate', async () => {
    await inMemoryUsersRepository.create(
      User.create({
        name: 'teste',
        email: 'teste@gmail.com',
        password_hash: await hashGenerator.hash('TESTE123'),
        role:'ADMIN'
      }),
    )

    const result = await authenticateUseCase.execute({
      email: 'teste@gmail.com',
      password: 'TESTE123',
    })

    expect(result.isRight() && result.value.user.id.toString()).toEqual(
      expect.any(String),
    )
  })

  it('should not  be able to authenticate with wrong email', async () => {
    const result = authenticateUseCase.execute({
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
        password_hash: await hashGenerator.hash('TESTE123'),
        role: 'ADMIN'
      }),
    )

    const duplicateRegistrationResult = await authenticateUseCase.execute({
      email: 'teste5@gmail.com',
      password: 'TESTE123312',
    })

    expect(
      duplicateRegistrationResult.isLeft() && duplicateRegistrationResult.value,
    ).toBeInstanceOf(UserNotExistsError)
  })
})
