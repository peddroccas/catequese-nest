import { Meeting } from '@/domain/meetings/entities/meeting'
import { MeetingTheme } from '@/domain/meetings/entities/meeting-theme'
import { toDateOnly } from '../../presenters/date.presenter'

export class MeetingThemePresenter {
  static toHTTP(theme: MeetingTheme) {
    return {
      id: theme.id.toString(),
      itinerary: theme.itinerary,
      phase: theme.phase,
      name: theme.name,
      position: theme.position,
      archivedAt: theme.archivedAt,
    }
  }
}

export class MeetingPresenter {
  static toHTTP(meeting: Meeting) {
    return {
      id: meeting.id.toString(),
      classroomId: meeting.classroomId.toString(),
      date: toDateOnly(meeting.date),
      themes: meeting.themes.map(MeetingThemePresenter.toHTTP),
      attendances: meeting.attendances.map(attendance => ({
        catechizingId: attendance.catechizingId.toString(),
        catechizingName: attendance.catechizingName,
        isPresent: attendance.isPresent,
      })),
    }
  }
}
