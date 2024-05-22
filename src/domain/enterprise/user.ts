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
  imageOriginalName: string
  imageFakeName: string
  imageType: string
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

  get imageOriginalName() {
    return this.props.imageOriginalName
  }

  set imageOriginalName(imageOriginalName: string) {
    this.props.imageOriginalName = imageOriginalName
  }

  get imageFakeName() {
    return this.props.imageFakeName
  }

  set imageFakeName(imageFakeName: string) {
    this.props.imageFakeName = imageFakeName
  }

  get status() {
    return this.props.status
  }

  set status(status: 'S' | 'N') {
    this.props.status = status
  }

  get imageType() {
    return this.props.imageType
  }

  set imageType(imageType: string) {
    this.props.imageType = imageType
  }
}
