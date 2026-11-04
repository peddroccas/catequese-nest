import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Meeting } from '@/domain/meetings/entities/meeting'
import { MeetingAttendance } from '@/domain/meetings/entities/meeting-attendance'
import { MeetingTheme } from '@/domain/meetings/entities/meeting-theme'
import { Itinerary } from '@/domain/meetings/enums/itinerary'
import {
  Prisma,
  Meeting as PrismaMeeting,
  MeetingAttendance as PrismaMeetingAttendance,
  MeetingTheme as PrismaMeetingTheme,
} from '@prisma/client'

export const meetingInclude = {
  themes: { orderBy: { position: 'asc' } },
  attendances: { include: { catechizing: { select: { name: true } } } },
} satisfies Prisma.MeetingInclude

type PrismaMeetingWithRelations = PrismaMeeting & {
  themes: PrismaMeetingTheme[]
  attendances: (PrismaMeetingAttendance & { catechizing: { name: string } })[]
}

export class MeetingThemeMapper {
  static toDomain(raw: PrismaMeetingTheme): MeetingTheme {
    return MeetingTheme.create(
      {
        itinerary: raw.itinerary as Itinerary,
        phase: raw.phase,
        name: raw.name,
        position: raw.position,
        archivedAt: raw.archivedAt,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(theme: MeetingTheme): PrismaMeetingTheme {
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

export class MeetingMapper {
  static toDomain(raw: PrismaMeetingWithRelations): Meeting {
    return Meeting.create(
      {
        classroomId: new UniqueEntityID(raw.classroomId),
        date: raw.date,
        themes: raw.themes.map(MeetingThemeMapper.toDomain),
        attendances: raw.attendances
          .map(attendance =>
            MeetingAttendance.create(
              {
                catechizingId: new UniqueEntityID(attendance.catechizingId),
                catechizingName: attendance.catechizing.name,
                isPresent: attendance.isPresent,
              },
              new UniqueEntityID(attendance.id)
            )
          )
          .sort((a, b) =>
            (a.catechizingName ?? '').localeCompare(b.catechizingName ?? '')
          ),
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(meeting: Meeting): PrismaMeeting {
    return {
      id: meeting.id.toString(),
      classroomId: meeting.classroomId.toString(),
      date: meeting.date,
    }
  }

  static themesToPrisma(meeting: Meeting) {
    return meeting.themes.map(theme => ({ id: theme.id.toString() }))
  }

  static attendancesToPrisma(meeting: Meeting) {
    return meeting.attendances.map(attendance => ({
      id: attendance.id.toString(),
      catechizingId: attendance.catechizingId.toString(),
      isPresent: attendance.isPresent,
    }))
  }
}
