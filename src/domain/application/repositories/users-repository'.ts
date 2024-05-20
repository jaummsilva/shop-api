import type { User } from '@/domain/enterprise/user'

export interface UsersRepository {
  create(data: User): Promise<User>
  update(data: User): Promise<User>
  findByEmail(email: string): Promise<User | null>
  findById(userId: string): Promise<User | null>
  findByEmailAndExcludeId(
    email: string,
    excludeId: string,
  ): Promise<User | null>
}
