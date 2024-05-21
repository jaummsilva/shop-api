import { HashAdapter } from 'test/cryptography/hash-adapter'
import { InMemoryUsersRepository } from 'test/repositories/in-memory/user/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import type { HashComparer } from '@/core/cryptography/hash-comparer'
import type { HashGenerator } from '@/core/cryptography/hash-generator'

import { UserAlreadyExistsError } from '../../errors/user/user-already-exists'
import { UserRegisterUseCase } from './register'

let inMemoryUsersRepository: InMemoryUsersRepository
let userRegisterUseCase: UserRegisterUseCase
let hashComparer: HashComparer
let hashGenerator: HashGenerator

describe('User Register Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    hashGenerator = new HashAdapter()
    hashComparer = new HashAdapter()
    userRegisterUseCase = new UserRegisterUseCase(
      inMemoryUsersRepository,
      hashGenerator,
    )
  })

  it('should be able to register', async () => {
    const birthdate = new Date('1990-01-01')

    const result = await userRegisterUseCase.execute({
      email: 'teste@gmail.com',
      password: 'TESTE123',
      name: 'João',
      role: 'ADMIN',
      phone: '123456789',
      photoPath: '/path/to/photo.jpg',
      birthdate,
    })

    if (result.isRight()) {
      expect(result.value.user.id.toString()).toEqual(expect.any(String))
      expect(result.value.user.email).toEqual('teste@gmail.com')
      expect(result.value.user.name).toEqual('João')
      expect(result.value.user.role).toEqual('ADMIN')
      expect(result.value.user.phone).toEqual('123456789')
      expect(result.value.user.photoPath).toEqual('/path/to/photo.jpg')
      expect(result.value.user.birthdate).toEqual(birthdate)
    }
  })

  it('should hash user password upon registration', async () => {
    const result = await userRegisterUseCase.execute({
      email: 'teste@gmail.com',
      password: 'TESTE123',
      name: 'João',
      role: 'ADMIN',
      phone: '123456789',
      photoPath: '/path/to/photo.jpg',
      birthdate: new Date('1990-01-01'),
    })

    if (result.isRight()) {
      const passwordHash = result.value.user.passwordHash

      const isPasswordCorrectlyHashed = await hashComparer.compare(
        'TESTE123',
        passwordHash.toString(),
      )

      expect(isPasswordCorrectlyHashed).toBe(true)
    }
  })

  it('should not be able to register same email twice', async () => {
    await userRegisterUseCase.execute({
      email: 'teste.10@gmail.com',
      password: 'TESTE123',
      name: 'João',
      role: 'ADMIN',
      phone: '123456789',
      photoPath: '/path/to/photo.jpg',
      birthdate: new Date('1990-01-01'),
    })

    const duplicateRegistrationResult = await userRegisterUseCase.execute({
      email: 'teste.10@gmail.com',
      password: 'TESTE123',
      name: 'João',
      role: 'ADMIN',
      phone: '123456789',
      photoPath: '/path/to/photo.jpg',
      birthdate: new Date('1990-01-01'),
    })

    expect(
      duplicateRegistrationResult.isLeft() && duplicateRegistrationResult.value,
    ).toBeInstanceOf(UserAlreadyExistsError)
  })
})
