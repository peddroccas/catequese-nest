import {
  CreateMeetingThemeUseCase,
  DeleteMeetingThemeUseCase,
  FetchMeetingThemesUseCase,
  UpdateMeetingThemeUseCase,
} from '@/domain/meetings/use-cases/meeting-theme.use-cases'
import {
  ClassroomAccess,
  CreateMeetingUseCase,
  DeleteMeetingUseCase,
  FetchClassroomMeetingsUseCase,
  MeetingBuilder,
  UpdateMeetingUseCase,
} from '@/domain/meetings/use-cases/meeting.use-cases'
import { Module } from '@nestjs/common'
import { MeetingThemeController } from './controllers/meeting-theme.controller'
import { MeetingController } from './controllers/meeting.controller'

@Module({
  controllers: [MeetingController, MeetingThemeController],
  providers: [
    ClassroomAccess,
    MeetingBuilder,
    FetchClassroomMeetingsUseCase,
    CreateMeetingUseCase,
    UpdateMeetingUseCase,
    DeleteMeetingUseCase,
    FetchMeetingThemesUseCase,
    CreateMeetingThemeUseCase,
    UpdateMeetingThemeUseCase,
    DeleteMeetingThemeUseCase,
  ],
})
export class MeetingModule {}
