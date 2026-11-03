import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface AttendanceProps {
  catechistId: UniqueEntityID
  isPresent: boolean
}

export class Attendance extends Entity<AttendanceProps> {
  get catechistId(): UniqueEntityID {
    return this.props.catechistId
  }

  get isPresent(): boolean {
    return this.props.isPresent
  }

  static create(props: AttendanceProps, id?: UniqueEntityID) {
    const attendance = new Attendance(props, id)

    return attendance
  }
}
