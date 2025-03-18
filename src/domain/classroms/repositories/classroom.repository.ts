import { Injectable } from '@nestjs/common'
import { Classroom } from '../entities/classroom'

@Injectable()
export abstract class ClassroomRepository {
  abstract create(classroom: Classroom): Promise<Classroom>
  abstract delete(id: string): Promise<void>
  abstract findById(id: string): Promise<Classroom | null>
  abstract findMany(id: string): Promise<Classroom[]>
  abstract update(classroom: Classroom): Promise<Classroom>
}
