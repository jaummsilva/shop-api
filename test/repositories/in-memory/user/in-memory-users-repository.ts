import type {
  FindManyParams,
  UsersRepository,
} from "@/domain/application/repositories/users-repository'"
import type { MetaResponse } from '@/domain/application/utils/meta-response'
import type { User } from '@/domain/enterprise/user'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async create(data: User) {
    this.items.push(data)

    return data
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async findById(userId: string) {
    const user = this.items.find((item) => item.id.toString() === userId)

    if (!user) {
      return null
    }

    return user
  }

  async findByEmailAndExcludeId(email: string, excludeId: string) {
    const user = this.items.find(
      (item) => item.email === email && excludeId !== item.id.toString(),
    )

    if (!user) {
      return null
    }

    return user
  }

  async update(data: User): Promise<User> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === data.id.toString(),
    )

    if (index !== -1) {
      this.items[index] = data
    }

    return data
  }

  async findMany(params: FindManyParams) {
    const { name = '', page = 1 } = params

    const filteredUsers = this.items.filter((item) => item.name.includes(name))

    const totalCount = filteredUsers.length
    const users = filteredUsers.slice((page - 1) * 10, page * 10)

    const meta: MetaResponse = {
      pageIndex: page,
      perPage: 10,
      totalCount,
    }

    return { users, meta }
  }
}
