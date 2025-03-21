import { ParentRepository } from '@/domain/catechizings/repositories/parent.repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Parent } from '@/domain/catechizings/entities/parent'

@Injectable()
export class PrismaParentRepository implements ParentRepository {
  constructor(private db: PrismaService) {}
  create(parent: Parent): Promise<Parent> {
    throw new Error('Method not implemented.')
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  findById(id: string): Promise<Parent | null> {
    throw new Error('Method not implemented.')
  }
  findByCatechizing(catechizigId: string): Promise<Parent | null> {
    throw new Error('Method not implemented.')
  }
  findMany(): Promise<Parent[]> {
    throw new Error('Method not implemented.')
  }
  update(parent: Parent): Promise<Parent> {
    throw new Error('Method not implemented.')
  }
}
