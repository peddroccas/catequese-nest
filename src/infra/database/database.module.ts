import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaCatechistRepository } from './prisma/repositories/catechist.repository'
import { CatechistRepository } from '@/domain/catechists/repositories/catechist.repository'
import { PrismaCatechizingRepository } from './prisma/repositories/catechizing.repository'
import { CatechizingRepository } from '@/domain/catechizings/repositories/catechizing.repository'
import { PrismaClassroomRepository } from './prisma/repositories/classroom.repository'
import { ClassroomRepository } from '@/domain/classroms/repositories/classroom.repository'

@Global()
@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: CatechistRepository,
      useClass: PrismaCatechistRepository,
    },
    {
      provide: CatechizingRepository,
      useClass: PrismaCatechizingRepository,
    },
    {
      provide: ClassroomRepository,
      useClass: PrismaClassroomRepository,
    },
  ],
  exports: [
    PrismaService,
    CatechistRepository,
    CatechizingRepository,
    ClassroomRepository,
  ],
})
export class DatabaseModule {}
