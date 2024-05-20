import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

type UserProps = {
  name: string
  email: string
  password_hash: string
  created_at?: Date
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
        created_at: props.created_at ?? new Date(),
      },
      id,
    )

    return user
  }

  get email() {
    return this.props.email
  }

  get password_hash() {
    return this.props.password_hash
  }

  get name() {
    return this.props.name
  }

  get created_at() {
    return this.props.created_at
  }

  get role() {
    return this.props.role
  }

  set email(email: string) {
    this.props.email = email
  }

  set password_hash(password_hash: string) {
    this.props.password_hash = password_hash
  }

  set name(name: string) {
    this.props.name = name
  }
}
