import { Meeting } from '@/domain/meetings/entities/meeting'
import { MeetingRepository } from '@/domain/meetings/repositories/meeting.repository'
import { Injectable } from '@nestjs/common'
import { MeetingMapper, meetingInclude } from '../mappers/meeting.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaMeetingRepository implements MeetingRepository {
  constructor(private db: PrismaService) {}

  async create(meeting: Meeting): Promise<void> {
    await this.db.meeting.create({
      data: {
        ...MeetingMapper.toPrisma(meeting),
        themes: { connect: MeetingMapper.themesToPrisma(meeting) },
        attendances: {
          createMany: { data: MeetingMapper.attendancesToPrisma(meeting) },
        },
      },
    })
  }

  async update(meeting: Meeting): Promise<void> {
    const { id, date } = MeetingMapper.toPrisma(meeting)

    // Temas e chamada são regravados inteiros a cada edição
    await this.db.$transaction([
      this.db.meeting.update({
        where: { id },
        data: { date, themes: { set: MeetingMapper.themesToPrisma(meeting) } },
      }),
      this.db.meetingAttendance.deleteMany({ where: { meetingId: id } }),
      this.db.meetingAttendance.createMany({
        data: MeetingMapper.attendancesToPrisma(meeting).map(attendance => ({
          ...attendance,
          meetingId: id,
        })),
      }),
    ])
  }

  async delete(id: string): Promise<void> {
    await this.db.meeting.delete({ where: { id } })
  }

  async findById(id: string): Promise<Meeting | null> {
    const meeting = await this.db.meeting.findUnique({
      where: { id },
      include: meetingInclude,
    })

    return meeting ? MeetingMapper.toDomain(meeting) : null
  }

  async findManyByClassroom(classroomId: string): Promise<Meeting[]> {
    const meetings = await this.db.meeting.findMany({
      where: { classroomId },
      include: meetingInclude,
      orderBy: { date: 'desc' },
    })

    return meetings.map(MeetingMapper.toDomain)
  }
}
