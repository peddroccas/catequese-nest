import { Module } from '@nestjs/common'
import { CatechistModule } from './catechists/catechist.module'
import { CatechizingModule } from './catechizings/catechizing.module'
import { ClassroomModule } from './classrooms/classroom.module'

@Module({
  imports: [CatechistModule, CatechizingModule, ClassroomModule],
})
export class HttpModule {}
