import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Attendance } from '@/domain/formations/entities/attendance'
import { Formation } from '@/domain/formations/entities/formation'
import {
  Formation as PrismaFormation,
  FormationAttendance as PrismaFormationAttendance,
} from '@prisma/client'

export class FormationMapper {
  static toDomain(
    raw: PrismaFormation & { attendances: PrismaFormationAttendance[] }
  ): Formation {
    return Formation.create(
      {
        theme: raw.theme,
        instructor: raw.instructor,
        date: raw.date,
        attendances: raw.attendances.map(attendance =>
          Attendance.create(
            {
              catechistId: new UniqueEntityID(attendance.catechistId),
              isPresent: attendance.isPresent,
            },
            new UniqueEntityID(attendance.id)
          )
        ),
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(formation: Formation): PrismaFormation {
    return {
      id: formation.id.toString(),
      theme: formation.theme,
      instructor: formation.instructor,
      date: formation.date,
    }
  }

  static attendancesToPrisma(formation: Formation) {
    return formation.attendances.map(attendance => ({
      id: attendance.id.toString(),
      catechistId: attendance.catechistId.toString(),
      isPresent: attendance.isPresent,
    }))
  }
}
