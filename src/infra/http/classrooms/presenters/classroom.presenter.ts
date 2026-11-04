import { Classroom } from '@/domain/classroms/entities/classroom'

// "Ana", "Ana e João", "Ana, João e Maria"
function joinNames(names: string[]) {
  if (names.length <= 1) {
    return names.join('')
  }
  return `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}`
}

export class ClassroomPresenter {
  static toHTTP(classroom: Classroom) {
    const nicknames = classroom.catechists.map(catechist => catechist.nickname)

    return {
      id: classroom.id.toString(),
      name: nicknames.length
        ? `${classroom.location} - ${joinNames(nicknames)}`
        : classroom.location,
      location: classroom.location,
      segment: classroom.segment,
      startedAt: classroom.startedAt,
      whatsappGroupLink: classroom.whatsappGroupLink,
      archivedAt: classroom.archivedAt?.toISOString() ?? null,
      catechists: classroom.catechists.map(catechist => ({
        id: catechist.id.toString(),
        name: catechist.name,
        nickname: catechist.nickname,
      })),
    }
  }
}
