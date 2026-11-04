import { Formation } from '@/domain/formations/entities/formation'
import { toDateOnly } from '../../presenters/date.presenter'

export class FormationPresenter {
  static toHTTP(formation: Formation) {
    return {
      id: formation.id.toString(),
      theme: formation.theme,
      instructor: formation.instructor,
      date: toDateOnly(formation.date),
      attendances: formation.attendances.map(attendance => ({
        catechistId: attendance.catechistId.toString(),
        isPresent: attendance.isPresent,
      })),
    }
  }
}
