import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

type UserProps = {
  name: string
  email: string
  passwordHash: string
  createdAt?: Date
  role: 'ADMIN' | 'MEMBER'
}

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id)
  }

  static create(props: UserProps, id?: UniqueEntityID): User {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return user
  }

  get email() {
    return this.props.email
  }

  get passwordHash() {
    return this.props.passwordHash
  }

  get name() {
    return this.props.name
  }

  get createdAt() {
    return this.props.createdAt
  }

  get role() {
    return this.props.role
  }

  set email(email: string) {
    this.props.email = email
  }

  set passwordHash(passwordHash: string) {
    this.props.passwordHash = passwordHash
  }

  set name(name: string) {
    this.props.name = name
  }
}
