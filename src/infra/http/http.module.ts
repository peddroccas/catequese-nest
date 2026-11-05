import { Module } from '@nestjs/common'
import { CatechistModule } from './catechists/catechist.module'
import { CatechizingModule } from './catechizings/catechizing.module'
import { ClassroomModule } from './classrooms/classroom.module'
import { FinanceModule } from './finances/finance.module'
import { FormationModule } from './formations/formation.module'
import { MeetingModule } from './meetings/meeting.module'
import { RegistrationModule } from './registrations/registration.module'
import { RiteModule } from './rites/rite.module'

@Module({
  imports: [
    CatechistModule,
    CatechizingModule,
    ClassroomModule,
    FinanceModule,
    FormationModule,
    MeetingModule,
    RiteModule,
    RegistrationModule,
  ],
})
export class HttpModule {}
