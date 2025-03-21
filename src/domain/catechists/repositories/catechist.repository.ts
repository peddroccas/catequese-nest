import { Catechist } from '../entities/catechist'

export abstract class CatechistRepository {
  abstract create(catechist: Catechist): Promise<void>
  abstract checkDuplicatedCredentials(
    email: string,
    id?: string
  ): Promise<boolean>
  abstract delete(id: string): Promise<void>
  abstract findById(id: string): Promise<Catechist | null>
  abstract findByEmail(email: string): Promise<Catechist | null>
  abstract findByClassroom(classroomId: string): Promise<Catechist[]>
  abstract findMany(): Promise<Catechist[]>
  abstract update(catechist: Catechist): Promise<void>
}
