import { Role } from '@/domain/catechists/enums/role'
import {
  CreateMeetingThemeRequestDto,
  FetchMeetingThemesRequestDto,
  UpdateMeetingThemeRequestDto,
} from '@/domain/meetings/dtos/request/meeting-theme.dto'
import {
  CreateMeetingThemeUseCase,
  DeleteMeetingThemeUseCase,
  FetchMeetingThemesUseCase,
  UpdateMeetingThemeUseCase,
} from '@/domain/meetings/use-cases/meeting-theme.use-cases'
import { Roles } from '@/infra/auth/roles.decorator'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { MeetingThemePresenter } from '../presenters/meeting.presenter'

// Todos leem os temas; só a coordenação edita
@Controller('/meeting-themes')
export class MeetingThemeController {
  constructor(
    private fetchMeetingThemes: FetchMeetingThemesUseCase,
    private createMeetingTheme: CreateMeetingThemeUseCase,
    private updateMeetingTheme: UpdateMeetingThemeUseCase,
    private deleteMeetingTheme: DeleteMeetingThemeUseCase
  ) {}

  @Get()
  async fetchAll(@Query() { itinerary }: FetchMeetingThemesRequestDto) {
    const response = await this.fetchMeetingThemes.execute(itinerary)

    return response.value?.themes.map(MeetingThemePresenter.toHTTP)
  }

  @Post()
  @Roles([Role.COORDINATOR])
  @HttpCode(201)
  async create(@Body() dto: CreateMeetingThemeRequestDto) {
    const response = await this.createMeetingTheme.execute(dto)

    return MeetingThemePresenter.toHTTP(response.value!.theme)
  }

  @Put()
  @Roles([Role.COORDINATOR])
  async update(@Body() dto: UpdateMeetingThemeRequestDto) {
    const response = await this.updateMeetingTheme.execute(dto)

    if (response.isLeft()) {
      throw new NotFoundException('Tema não encontrado')
    }

    return MeetingThemePresenter.toHTTP(response.value.theme)
  }

  @Delete('/:id')
  @Roles([Role.COORDINATOR])
  @HttpCode(204)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const response = await this.deleteMeetingTheme.execute(id)

    if (response.isLeft()) {
      throw new NotFoundException('Tema não encontrado')
    }
  }
}
