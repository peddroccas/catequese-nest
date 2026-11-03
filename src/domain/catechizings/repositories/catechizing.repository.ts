import { Injectable } from '@nestjs/common'
import { Catechizing } from '../entities/catechizing'

@Injectable()
export abstract class CatechizingRepository {
  abstract create(catechizing: Catechizing): Promise<Catechizing>
  abstract delete(id: string): Promise<void>
  abstract findById(id: string): Promise<Catechizing | null>
  // Ativos: nem o catequizando nem a turma dele estão arquivados
  abstract findMany(): Promise<Catechizing[]>
  abstract findManyArchived(): Promise<Catechizing[]>
  abstract archive(id: string): Promise<void>
  abstract restore(id: string, classroomId: string): Promise<void>
  abstract findByClassroom(classroomId: string): Promise<Catechizing[]>
  abstract update(catechizing: Catechizing): Promise<Catechizing>
}
