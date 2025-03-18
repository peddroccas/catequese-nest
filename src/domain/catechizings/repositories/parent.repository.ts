import { Injectable } from '@nestjs/common'
import { Parent } from '../entities/parent'

@Injectable()
export abstract class ParentRepository {
  abstract create(parent: Parent): Promise<Parent>
  abstract delete(id: string): Promise<void>
  abstract findById(id: string): Promise<Parent | null>
  abstract findMany(): Promise<Parent[]>
  abstract update(parent: Parent): Promise<Parent>
}
