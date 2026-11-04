import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Role } from '@/domain/catechists/enums/role'
import { CatechistRepository } from '@/domain/catechists/repositories/catechist.repository'
import { CatechizingRepository } from '@/domain/catechizings/repositories/catechizing.repository'
import { ClassroomRepository } from '@/domain/classroms/repositories/classroom.repository'
import { Injectable } from '@nestjs/common'
import {
  CreateMeetingRequestDto,
  MeetingAttendanceRequestDto,
  UpdateMeetingRequestDto,
} from '../dtos/request/meeting.dto'
import { Meeting } from '../entities/meeting'
import { MeetingAttendance } from '../entities/meeting-attendance'
import { MeetingThemeRepository } from '../repositories/meeting-theme.repository'
import { MeetingRepository } from '../repositories/meeting.repository'

export interface MeetingUser {
  id: string
  role: Role
}

type MeetingError = ResourceNotFoundError | NotAllowedError

// Coordenação acessa todas as turmas; catequista, só as suas
@Injectable()
export class ClassroomAccess {
  constructor(private catechistRepository: CatechistRepository) {}

  async canAccess(user: MeetingUser, classroomId: string) {
    if (user.role === Role.COORDINATOR) {
      return true
    }
    const catechist = await this.catechistRepository.findById(user.id)
    return Boolean(
      catechist?.classroomIds.some(id => id.toString() === classroomId)
    )
  }
}

// Confere temas e catequizandos e monta o encontro
@Injectable()
export class MeetingBuilder {
  constructor(
    private meetingThemeRepository: MeetingThemeRepository,
    private catechizingRepository: CatechizingRepository
  ) {}

  async build(
    data: {
      classroomId: string
      date: Date
      themeIds: string[]
      attendances: MeetingAttendanceRequestDto[]
    },
    id?: UniqueEntityID
  ): Promise<Meeting | null> {
    const themeIds = [...new Set(data.themeIds)]
    const themes = await this.meetingThemeRepository.findManyByIds(themeIds)

    if (themes.length !== themeIds.length) {
      return null
    }

    for (const { catechizingId } of data.attendances) {
      const catechizing =
        await this.catechizingRepository.findById(catechizingId)

      if (!catechizing) {
        return null
      }
    }

    return Meeting.create(
      {
        classroomId: new UniqueEntityID(data.classroomId),
        date: data.date,
        themes,
        attendances: data.attendances.map(attendance =>
          MeetingAttendance.create({
            catechizingId: new UniqueEntityID(attendance.catechizingId),
            isPresent: attendance.isPresent,
          })
        ),
      },
      id
    )
  }
}

@Injectable()
export class FetchClassroomMeetingsUseCase {
  constructor(
    private meetingRepository: MeetingRepository,
    private classroomAccess: ClassroomAccess
  ) {}

  async execute(
    classroomId: string,
    user: MeetingUser
  ): Promise<Either<NotAllowedError, { meetings: Meeting[] }>> {
    if (!(await this.classroomAccess.canAccess(user, classroomId))) {
      return left(new NotAllowedError())
    }

    const meetings =
      await this.meetingRepository.findManyByClassroom(classroomId)

    return right({ meetings })
  }
}

@Injectable()
export class CreateMeetingUseCase {
  constructor(
    private meetingRepository: MeetingRepository,
    private classroomRepository: ClassroomRepository,
    private classroomAccess: ClassroomAccess,
    private meetingBuilder: MeetingBuilder
  ) {}

  async execute(
    data: CreateMeetingRequestDto,
    user: MeetingUser
  ): Promise<Either<MeetingError, { meeting: Meeting }>> {
    if (!(await this.classroomRepository.exists(data.classroomId))) {
      return left(new ResourceNotFoundError())
    }

    if (!(await this.classroomAccess.canAccess(user, data.classroomId))) {
      return left(new NotAllowedError())
    }

    const meeting = await this.meetingBuilder.build(data)

    if (!meeting) {
      return left(new ResourceNotFoundError())
    }

    await this.meetingRepository.create(meeting)

    return right({ meeting })
  }
}

@Injectable()
export class UpdateMeetingUseCase {
  constructor(
    private meetingRepository: MeetingRepository,
    private classroomAccess: ClassroomAccess,
    private meetingBuilder: MeetingBuilder
  ) {}

  async execute(
    data: UpdateMeetingRequestDto,
    user: MeetingUser
  ): Promise<Either<MeetingError, { meeting: Meeting }>> {
    const current = await this.meetingRepository.findById(data.id)

    if (!current) {
      return left(new ResourceNotFoundError())
    }

    const classroomId = current.classroomId.toString()

    if (!(await this.classroomAccess.canAccess(user, classroomId))) {
      return left(new NotAllowedError())
    }

    const meeting = await this.meetingBuilder.build(
      { ...data, classroomId },
      current.id
    )

    if (!meeting) {
      return left(new ResourceNotFoundError())
    }

    await this.meetingRepository.update(meeting)

    return right({ meeting })
  }
}

@Injectable()
export class DeleteMeetingUseCase {
  constructor(
    private meetingRepository: MeetingRepository,
    private classroomAccess: ClassroomAccess
  ) {}

  async execute(
    id: string,
    user: MeetingUser
  ): Promise<Either<MeetingError, null>> {
    const meeting = await this.meetingRepository.findById(id)

    if (!meeting) {
      return left(new ResourceNotFoundError())
    }

    if (
      !(await this.classroomAccess.canAccess(
        user,
        meeting.classroomId.toString()
      ))
    ) {
      return left(new NotAllowedError())
    }

    await this.meetingRepository.delete(id)

    return right(null)
  }
}
