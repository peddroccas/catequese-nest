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

  classroomIds: UniqueEntityID[]

  email: string
  password_hash: string
  archivedAt?: Date | null
  avatarUrl?: string | null
}

export class Catechist extends Entity<CatechistProps> {
  get name(): string {
    return this.props.name
  }

  get nickname(): string {
    return this.props.nickname
  }

  get classroomIds(): UniqueEntityID[] {
    return this.props.classroomIds
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

  // Data em que foi para o arquivo; null enquanto está ativo
  get archivedAt(): Date | null {
    return this.props.archivedAt ?? null
  }

  // URL pública da foto de perfil; null quando não tem foto
  get avatarUrl(): string | null {
    return this.props.avatarUrl ?? null
  }

  static create(props: CatechistProps, id?: UniqueEntityID) {
    const catechist = new Catechist(props, id)

    return catechist
  }
}
