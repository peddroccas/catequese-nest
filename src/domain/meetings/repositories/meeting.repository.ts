import { Injectable } from '@nestjs/common'
import { Meeting } from '../entities/meeting'

@Injectable()
export abstract class MeetingRepository {
  abstract create(meeting: Meeting): Promise<void>
  abstract update(meeting: Meeting): Promise<void>
  abstract delete(id: string): Promise<void>
  abstract findById(id: string): Promise<Meeting | null>
  // Mais recentes primeiro
  abstract findManyByClassroom(classroomId: string): Promise<Meeting[]>
}
