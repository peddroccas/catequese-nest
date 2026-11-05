import { Module } from '@nestjs/common'
import { CatechistModule } from './catechists/catechist.module'
import { CatechizingModule } from './catechizings/catechizing.module'
import { ClassroomModule } from './classrooms/classroom.module'
import { FinanceModule } from './finances/finance.module'
import { FormationModule } from './formations/formation.module'
import { MeetingModule } from './meetings/meeting.module'

@Module({
  imports: [
    CatechistModule,
    CatechizingModule,
    ClassroomModule,
    FinanceModule,
    FormationModule,
    MeetingModule,
  ],
})
export class HttpModule {}
