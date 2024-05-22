import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

type UserProps = {
  name: string
  email: string
  passwordHash: string
  phone: string
  createdAt?: Date
  updatedAt?: Date
  role: 'ADMIN' | 'MEMBER'
  birthdate: Date
  photoPath: string
  status: 'S' | 'N'
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

  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get email() {
    return this.props.email
  }

  set email(email: string) {
    this.props.email = email
  }

  get passwordHash() {
    return this.props.passwordHash
  }

  set passwordHash(passwordHash: string) {
    this.props.passwordHash = passwordHash
  }

  get phone() {
    return this.props.phone
  }

  set phone(phone: string) {
    this.props.phone = phone
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set role(role: 'ADMIN' | 'MEMBER') {
    this.props.role = role
  }

  get role() {
    return this.props.role
  }

  get birthdate() {
    return this.props.birthdate
  }

  set birthdate(birthdate: Date) {
    this.props.birthdate = birthdate
  }

  get photoPath() {
    return this.props.photoPath
  }

  set photoPath(photoPath: string) {
    this.props.photoPath = photoPath
  }

  get status() {
    return this.props.status
  }

  set status(status: 'S' | 'N') {
    this.props.status = status
  }
}
