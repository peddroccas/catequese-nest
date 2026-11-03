import { Injectable } from '@nestjs/common'
import { Classroom } from '../entities/classroom'
import { Segment } from '../enums/segment'

@Injectable()
export abstract class ClassroomRepository {
  abstract create(classroom: Classroom): Promise<void>
  abstract delete(id: string): Promise<void>
  abstract findById(id: string): Promise<Classroom | null>
  // Só turmas ativas (não arquivadas)
  abstract exists(id: string): Promise<boolean>
  abstract findMany(segment?: Segment): Promise<Classroom[]>
  abstract findManyArchived(): Promise<Classroom[]>
  abstract archive(id: string): Promise<void>
  abstract restore(id: string): Promise<void>
  abstract update(classroom: Classroom): Promise<void>
}
