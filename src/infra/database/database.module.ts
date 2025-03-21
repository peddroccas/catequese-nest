import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaCatechistRepository } from './prisma/repositories/catechist.repository'
import { CatechistRepository } from '@/domain/catechists/repositories/catechist.repository'

@Global()
@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: CatechistRepository,
      useClass: PrismaCatechistRepository,
    },
  ],
  exports: [PrismaService, CatechistRepository],
})
export class DatabaseModule {}
