import { HashAdapter } from 'test/cryptography/hash-adapter'
import { InMemoryUsersRepository } from 'test/repositories/in-memory/user/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import type { HashGenerator } from '@/core/cryptography/hash-generator'
import { User } from '@/domain/enterprise/user'

import { GetProfileUseCase } from './get-profile'

let inMemoryUsersRepository: InMemoryUsersRepository
let getProfileUseCase: GetProfileUseCase
let hashGenerator: HashGenerator

describe('Get Profile Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    hashGenerator = new HashAdapter()
    getProfileUseCase = new GetProfileUseCase(inMemoryUsersRepository)
  })

  it('should be able to get profile', async () => {
    const userCreated = await inMemoryUsersRepository.create(
      User.create({
        name: 'teste',
        email: 'teste@gmail.com',
        passwordHash: await hashGenerator.hash('TESTE123'),
        role: 'ADMIN',
      }),
    )

    const result = await getProfileUseCase.execute({
      userId: userCreated.id.toString(),
    })

    if (result.isRight()) {
      expect(result.value.user.id.toString()).toEqual(expect.any(String))
    }
  })

  it('should not be able to get profile', async () => {
    const result = await getProfileUseCase.execute({
      userId: 'not-existing-id',
    })
    expect(result.isLeft()).toBeTruthy()
  })
})
