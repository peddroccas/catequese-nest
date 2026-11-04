import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import {
  CreateMeetingThemeRequestDto,
  UpdateMeetingThemeRequestDto,
} from '../dtos/request/meeting-theme.dto'
import { MeetingTheme } from '../entities/meeting-theme'
import { Itinerary } from '../enums/itinerary'
import { MeetingThemeRepository } from '../repositories/meeting-theme.repository'

const PHASE_STEP = 100

// Tema novo vai para o fim da fase; fase nova vai para o fim do itinerário
async function nextPosition(
  repository: MeetingThemeRepository,
  itinerary: Itinerary,
  phase: string
) {
  const lastInPhase = await repository.findLastPosition(itinerary, phase)
  if (lastInPhase !== null) {
    return lastInPhase + 1
  }
  const last = await repository.findLastPosition(itinerary)
  return last === null
    ? PHASE_STEP
    : (Math.floor(last / PHASE_STEP) + 1) * PHASE_STEP
}

@Injectable()
export class FetchMeetingThemesUseCase {
  constructor(private meetingThemeRepository: MeetingThemeRepository) {}

  async execute(
    itinerary?: Itinerary
  ): Promise<Either<null, { themes: MeetingTheme[] }>> {
    const themes = await this.meetingThemeRepository.findMany(itinerary)

    return right({ themes })
  }
}

@Injectable()
export class CreateMeetingThemeUseCase {
  constructor(private meetingThemeRepository: MeetingThemeRepository) {}

  async execute({
    itinerary,
    phase,
    name,
  }: CreateMeetingThemeRequestDto): Promise<
    Either<null, { theme: MeetingTheme }>
  > {
    const theme = MeetingTheme.create({
      itinerary,
      phase,
      name,
      position: await nextPosition(
        this.meetingThemeRepository,
        itinerary,
        phase
      ),
    })

    await this.meetingThemeRepository.create(theme)

    return right({ theme })
  }
}

@Injectable()
export class UpdateMeetingThemeUseCase {
  constructor(private meetingThemeRepository: MeetingThemeRepository) {}

  async execute({
    id,
    phase,
    name,
  }: UpdateMeetingThemeRequestDto): Promise<
    Either<ResourceNotFoundError, { theme: MeetingTheme }>
  > {
    const current = await this.meetingThemeRepository.findById(id)

    if (!current || current.archivedAt) {
      return left(new ResourceNotFoundError())
    }

    const position =
      current.phase === phase
        ? current.position
        : await nextPosition(
            this.meetingThemeRepository,
            current.itinerary,
            phase
          )

    const theme = MeetingTheme.create(
      { itinerary: current.itinerary, phase, name, position },
      current.id
    )

    await this.meetingThemeRepository.update(theme)

    return right({ theme })
  }
}

// Exclusão lógica: o tema continua nas chamadas já feitas
@Injectable()
export class DeleteMeetingThemeUseCase {
  constructor(private meetingThemeRepository: MeetingThemeRepository) {}

  async execute(id: string): Promise<Either<ResourceNotFoundError, null>> {
    const theme = await this.meetingThemeRepository.findById(id)

    if (!theme || theme.archivedAt) {
      return left(new ResourceNotFoundError())
    }

    await this.meetingThemeRepository.archive(id)

    return right(null)
  }
}
