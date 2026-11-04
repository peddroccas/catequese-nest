import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import {
  CreateMeetingRequestDto,
  FetchClassroomMeetingsRequestDto,
  UpdateMeetingRequestDto,
} from '@/domain/meetings/dtos/request/meeting.dto'
import {
  CreateMeetingUseCase,
  DeleteMeetingUseCase,
  FetchClassroomMeetingsUseCase,
  MeetingUser,
  UpdateMeetingUseCase,
} from '@/domain/meetings/use-cases/meeting.use-cases'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/token.dto'
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { MeetingPresenter } from '../presenters/meeting.presenter'

function toMeetingUser(user: UserPayload): MeetingUser {
  return { id: user.sub, role: user.role }
}

function toHttpError(error: Error) {
  return error instanceof NotAllowedError
    ? new ForbiddenException('Você não tem acesso a esta turma')
    : new NotFoundException('Turma, tema ou catequizando não encontrado')
}

// Chamadas dos encontros: catequistas da turma e coordenação
@Controller('/meetings')
export class MeetingController {
  constructor(
    private fetchClassroomMeetings: FetchClassroomMeetingsUseCase,
    private createMeeting: CreateMeetingUseCase,
    private updateMeeting: UpdateMeetingUseCase,
    private deleteMeeting: DeleteMeetingUseCase
  ) {}

  @Get()
  async fetchByClassroom(
    @Query() { classroomId }: FetchClassroomMeetingsRequestDto,
    @CurrentUser() user: UserPayload
  ) {
    const response = await this.fetchClassroomMeetings.execute(
      classroomId,
      toMeetingUser(user)
    )

    if (response.isLeft()) {
      throw toHttpError(response.value)
    }

    return response.value.meetings.map(MeetingPresenter.toHTTP)
  }

  @Post()
  @HttpCode(201)
  async create(
    @Body() dto: CreateMeetingRequestDto,
    @CurrentUser() user: UserPayload
  ) {
    const response = await this.createMeeting.execute(dto, toMeetingUser(user))

    if (response.isLeft()) {
      throw toHttpError(response.value)
    }

    return MeetingPresenter.toHTTP(response.value.meeting)
  }

  @Put()
  async update(
    @Body() dto: UpdateMeetingRequestDto,
    @CurrentUser() user: UserPayload
  ) {
    const response = await this.updateMeeting.execute(dto, toMeetingUser(user))

    if (response.isLeft()) {
      throw toHttpError(response.value)
    }

    return MeetingPresenter.toHTTP(response.value.meeting)
  }

  @Delete('/:id')
  @HttpCode(204)
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: UserPayload
  ) {
    const response = await this.deleteMeeting.execute(id, toMeetingUser(user))

    if (response.isLeft()) {
      throw toHttpError(response.value)
    }
  }
}
