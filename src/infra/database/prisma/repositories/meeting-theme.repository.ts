import { MeetingTheme } from '@/domain/meetings/entities/meeting-theme'
import { Itinerary } from '@/domain/meetings/enums/itinerary'
import { MeetingThemeRepository } from '@/domain/meetings/repositories/meeting-theme.repository'
import { Injectable } from '@nestjs/common'
import { MeetingThemeMapper } from '../mappers/meeting.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaMeetingThemeRepository implements MeetingThemeRepository {
  constructor(private db: PrismaService) {}

  async create(theme: MeetingTheme): Promise<void> {
    await this.db.meetingTheme.create({
      data: MeetingThemeMapper.toPrisma(theme),
    })
  }

  async update(theme: MeetingTheme): Promise<void> {
    const { id, phase, name, position } = MeetingThemeMapper.toPrisma(theme)

    await this.db.meetingTheme.update({
      where: { id },
      data: { phase, name, position },
    })
  }

  async archive(id: string): Promise<void> {
    await this.db.meetingTheme.update({
      where: { id },
      data: { archivedAt: new Date() },
    })
  }

  async findById(id: string): Promise<MeetingTheme | null> {
    const theme = await this.db.meetingTheme.findUnique({ where: { id } })

    return theme ? MeetingThemeMapper.toDomain(theme) : null
  }

  async findManyByIds(ids: string[]): Promise<MeetingTheme[]> {
    const themes = await this.db.meetingTheme.findMany({
      where: { id: { in: ids } },
      orderBy: { position: 'asc' },
    })

    return themes.map(MeetingThemeMapper.toDomain)
  }

  async findMany(itinerary?: Itinerary): Promise<MeetingTheme[]> {
    const themes = await this.db.meetingTheme.findMany({
      where: { itinerary, archivedAt: null },
      orderBy: [{ itinerary: 'asc' }, { position: 'asc' }],
    })

    return themes.map(MeetingThemeMapper.toDomain)
  }

  async findLastPosition(
    itinerary: Itinerary,
    phase?: string
  ): Promise<number | null> {
    // Conta também os excluídos para não reaproveitar posições
    const result = await this.db.meetingTheme.aggregate({
      where: { itinerary, phase },
      _max: { position: true },
    })

    return result._max.position
  }
}
