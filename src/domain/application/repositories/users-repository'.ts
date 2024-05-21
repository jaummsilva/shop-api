import type { User } from '@/domain/enterprise/user'

import type { MetaResponse } from '../utils/meta-response'

export interface FindManyParams {
  name?: string
  page?: number
}

export interface UsersRepository {
  create(data: User): Promise<User>
  update(data: User): Promise<User>
  findMany(
    params: FindManyParams,
  ): Promise<{ users: User[]; meta: MetaResponse }>

  findByEmail(email: string): Promise<User | null>
  findById(userId: string): Promise<User | null>
  findByEmailAndExcludeId(
    email: string,
    excludeId: string,
  ): Promise<User | null>
}
