import { Injectable } from '@nestjs/common'
import { Formation } from '@/domain/formations/entities/formation'
import { FormationRepository } from '@/domain/formations/repositories/formation.repository'
import { PrismaService } from '../prisma.service'
import { FormationMapper } from '../mappers/formation.mapper'

@Injectable()
export class PrismaFormationRepository implements FormationRepository {
  constructor(private db: PrismaService) {}

  async create(formation: Formation): Promise<void> {
    const data = FormationMapper.toPrisma(formation)

    await this.db.formation.create({
      data: {
        ...data,
        attendances: {
          createMany: { data: FormationMapper.attendancesToPrisma(formation) },
        },
      },
    })
  }
  async delete(id: string): Promise<void> {
    await this.db.formation.delete({ where: { id } })
  }
  async findById(id: string): Promise<Formation | null> {
    const response = await this.db.formation.findUnique({
      where: { id },
      include: { attendances: true },
    })

    if (!response) {
      return null
    }

    return FormationMapper.toDomain(response)
  }
  async findMany(): Promise<Formation[]> {
    const response = await this.db.formation.findMany({
      include: { attendances: true },
      orderBy: { date: 'desc' },
    })

    return response.map(FormationMapper.toDomain)
  }
  async update(formation: Formation): Promise<void> {
    const { id, ...data } = FormationMapper.toPrisma(formation)

    // A chamada é regravada inteira a cada edição
    await this.db.$transaction([
      this.db.formation.update({ where: { id }, data }),
      this.db.formationAttendance.deleteMany({ where: { formationId: id } }),
      this.db.formationAttendance.createMany({
        data: FormationMapper.attendancesToPrisma(formation).map(
          attendance => ({ ...attendance, formationId: id })
        ),
      }),
    ])
  }
}
