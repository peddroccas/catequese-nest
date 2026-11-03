import { Module } from '@nestjs/common'
import { CatechistModule } from './catechists/catechist.module'
import { CatechizingModule } from './catechizings/catechizing.module'
import { ClassroomModule } from './classrooms/classroom.module'
import { FormationModule } from './formations/formation.module'

@Module({
  imports: [
    CatechistModule,
    CatechizingModule,
    ClassroomModule,
    FormationModule,
  ],
})
export class HttpModule {}
