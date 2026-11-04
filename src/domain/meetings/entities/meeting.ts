import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { MeetingAttendance } from './meeting-attendance'
import { MeetingTheme } from './meeting-theme'

export interface MeetingProps {
  classroomId: UniqueEntityID
  date: Date
  // Um encontro pode juntar mais de um tema
  themes: MeetingTheme[]
  attendances: MeetingAttendance[]
}

// Encontro de uma turma com a chamada dos catequizandos
export class Meeting extends Entity<MeetingProps> {
  get classroomId(): UniqueEntityID {
    return this.props.classroomId
  }

  get date(): Date {
    return this.props.date
  }

  get themes(): MeetingTheme[] {
    return this.props.themes
  }

  get attendances(): MeetingAttendance[] {
    return this.props.attendances
  }

  static create(props: MeetingProps, id?: UniqueEntityID) {
    return new Meeting(props, id)
  }
}
