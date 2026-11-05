import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaCatechistRepository } from './prisma/repositories/catechist.repository'
import { CatechistRepository } from '@/domain/catechists/repositories/catechist.repository'
import { PrismaCatechizingRepository } from './prisma/repositories/catechizing.repository'
import { CatechizingRepository } from '@/domain/catechizings/repositories/catechizing.repository'
import { PrismaClassroomRepository } from './prisma/repositories/classroom.repository'
import { ClassroomRepository } from '@/domain/classroms/repositories/classroom.repository'
import { PrismaFormationRepository } from './prisma/repositories/formation.repository'
import { FormationRepository } from '@/domain/formations/repositories/formation.repository'
import { PrismaMeetingRepository } from './prisma/repositories/meeting.repository'
import { MeetingRepository } from '@/domain/meetings/repositories/meeting.repository'
import { PrismaMeetingThemeRepository } from './prisma/repositories/meeting-theme.repository'
import { MeetingThemeRepository } from '@/domain/meetings/repositories/meeting-theme.repository'
import { PrismaExpenseRepository } from './prisma/repositories/expense.repository'
import { ExpenseRepository } from '@/domain/finances/repositories/expense.repository'
import { PrismaEntryRepository } from './prisma/repositories/entry.repository'
import { EntryRepository } from '@/domain/finances/repositories/entry.repository'

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
    {
      provide: FormationRepository,
      useClass: PrismaFormationRepository,
    },
    {
      provide: MeetingRepository,
      useClass: PrismaMeetingRepository,
    },
    {
      provide: MeetingThemeRepository,
      useClass: PrismaMeetingThemeRepository,
    },
    {
      provide: ExpenseRepository,
      useClass: PrismaExpenseRepository,
    },
    {
      provide: EntryRepository,
      useClass: PrismaEntryRepository,
    },
  ],
  exports: [
    PrismaService,
    CatechistRepository,
    CatechizingRepository,
    ClassroomRepository,
    FormationRepository,
    MeetingRepository,
    MeetingThemeRepository,
    ExpenseRepository,
    EntryRepository,
  ],
})
export class DatabaseModule {}
