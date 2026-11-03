import { Injectable } from '@nestjs/common'
import { Formation } from '../entities/formation'

@Injectable()
export abstract class FormationRepository {
  abstract create(formation: Formation): Promise<void>
  abstract delete(id: string): Promise<void>
  abstract findById(id: string): Promise<Formation | null>
  abstract findMany(): Promise<Formation[]>
  abstract update(formation: Formation): Promise<void>
}
