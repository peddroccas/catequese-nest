import { Classroom } from '@/domain/classroms/entities/classroom'

export class ClassroomPresenter {
  static toHTTP(classroom: Classroom) {
    const nicknames = classroom.catechists.map(catechist => catechist.nickname)

    return {
      id: classroom.id.toString(),
      name: nicknames.length
        ? `${classroom.location} - ${nicknames.join(' e ')}`
        : classroom.location,
      location: classroom.location,
      segment: classroom.segment,
      startedAt: classroom.startedAt,
      catechists: classroom.catechists.map(catechist => ({
        id: catechist.id.toString(),
        name: catechist.name,
        nickname: catechist.nickname,
      })),
    }
  }
}
