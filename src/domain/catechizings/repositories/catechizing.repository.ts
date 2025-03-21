import { Injectable } from '@nestjs/common'
import { Catechizing } from '../entities/catechizing'

@Injectable()
export abstract class CatechizingRepository {
  abstract create(catechizing: Catechizing): Promise<Catechizing>
  abstract delete(id: string): Promise<void>
  abstract findById(id: string): Promise<Catechizing | null>
  abstract findMany(): Promise<Catechizing[]>
  abstract findByClassroom(classroomId: string): Promise<Catechizing[]>
  abstract update(catechizing: Catechizing): Promise<Catechizing>
}
