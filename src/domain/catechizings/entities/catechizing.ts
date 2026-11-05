import { Entity } from '@/core/entities/entity'
import { Parent } from './parent'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { MaritalStatus } from '../enums/marital-status'

export interface CatechizingProps {
  name: string
  birthday: Date
  address: string
  personWithSpecialNeeds: boolean
  specialNeedsDescription: string | null
  releasedToGoAwayAlone: boolean

  // Só preenchidos em turmas de adultos
  maritalStatus: MaritalStatus | null
  livesWithPartner: boolean | null
  archivedAt?: Date | null

  hasReceivedBaptism: boolean
  hasReceivedEucharist: boolean
  hasReceivedMarriage: boolean

  // Vêm da ficha de inscrição
  shirtSize?: string | null
  foodRestriction?: string | null
  pickupAuthorizedBy?: string | null

  classroomId: UniqueEntityID
  parents: Parent[]
}

export class Catechizing extends Entity<CatechizingProps> {
  get name(): string {
    return this.props.name
  }

  get birthday(): Date {
    return this.props.birthday
  }

  get address(): string {
    return this.props.address
  }

  get personWithSpecialNeeds(): boolean {
    return this.props.personWithSpecialNeeds
  }

  get hasReceivedBaptism(): boolean {
    return this.props.hasReceivedBaptism
  }

  get hasReceivedEucharist(): boolean {
    return this.props.hasReceivedEucharist
  }

  get hasReceivedMarriage(): boolean {
    return this.props.hasReceivedMarriage
  }

  get shirtSize(): string | null {
    return this.props.shirtSize ?? null
  }

  get foodRestriction(): string | null {
    return this.props.foodRestriction ?? null
  }

  get pickupAuthorizedBy(): string | null {
    return this.props.pickupAuthorizedBy ?? null
  }

  get parents(): Parent[] {
    return this.props.parents
  }

  get classroomId(): UniqueEntityID {
    return this.props.classroomId
  }

  get releasedToGoAwayAlone(): boolean {
    return this.props.releasedToGoAwayAlone
  }

  get specialNeedsDescription(): string | null {
    return this.props.specialNeedsDescription
  }

  get maritalStatus(): MaritalStatus | null {
    return this.props.maritalStatus
  }

  get livesWithPartner(): boolean | null {
    return this.props.livesWithPartner
  }

  // Data em que foi para o arquivo; null enquanto está ativo
  get archivedAt(): Date | null {
    return this.props.archivedAt ?? null
  }

  static create(props: CatechizingProps, id?: UniqueEntityID) {
    const catechizing = new Catechizing(props, id)

    return catechizing
  }
}
