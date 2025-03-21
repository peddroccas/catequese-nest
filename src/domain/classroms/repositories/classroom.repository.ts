import { Injectable } from '@nestjs/common'
import { Classroom } from '../entities/classroom'

@Injectable()
export abstract class ClassroomRepository {
  abstract create(classroom: Classroom): Promise<void>
  abstract delete(id: string): Promise<void>
  abstract findById(id: string): Promise<Classroom | null>
  abstract findMany(): Promise<Classroom[]>
  abstract update(classroom: Classroom): Promise<void>
}
