import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Role } from '../enums/role'

export interface CatechistProps {
  name: string
  nickname: string
  role: Role
  birthday: Date
  phone: string
  address: string

  hasReceivedBaptism: boolean
  hasReceivedEucharist: boolean
  hasReceivedConfirmation: boolean
  hasReceivedMarriage: boolean

  classroomId?: UniqueEntityID

  email: string
  password_hash: string
}

export class Catechist extends Entity<CatechistProps> {
  get name(): string {
    return this.props.name
  }

  get nickname(): string {
    return this.props.nickname
  }

  get classroomId(): UniqueEntityID | undefined {
    return this.props.classroomId
  }

  get role(): Role {
    return this.props.role
  }

  get birthday(): Date {
    return this.props.birthday
  }

  get phone(): string {
    return this.props.phone
  }

  get address(): string {
    return this.props.address
  }

  get hasReceivedBaptism(): boolean {
    return this.props.hasReceivedBaptism
  }

  get hasReceivedEucharist(): boolean {
    return this.props.hasReceivedEucharist
  }

  get hasReceivedConfirmation(): boolean {
    return this.props.hasReceivedConfirmation
  }

  get hasReceivedMarriage(): boolean {
    return this.props.hasReceivedMarriage
  }

  get email(): string {
    return this.props.email
  }

  get passwordHash(): string {
    return this.props.password_hash
  }

  static create(props: CatechistProps, id?: UniqueEntityID) {
    const catechist = new Catechist(props, id)

    return catechist
  }
}
