import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

// PDF anexado a um rito (URL pública)
export interface RiteFile {
  id: string
  // Nome original do arquivo
  name: string
  url: string
}

export interface RiteProps {
  name: string
  description?: string | null
  // Um rito pode ter mais de um PDF (ex.: roteiro e folder)
  files?: RiteFile[]
}

export class Rite extends Entity<RiteProps> {
  get name(): string {
    return this.props.name
  }

  get description(): string | null {
    return this.props.description ?? null
  }

  get files(): RiteFile[] {
    return this.props.files ?? []
  }

  static create(props: RiteProps, id?: UniqueEntityID) {
    return new Rite(props, id)
  }
}
