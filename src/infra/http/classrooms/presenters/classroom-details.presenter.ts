import { Classroom } from '@/domain/classroms/entities/classroom'
import { CatechizingPresenter } from '../../catechizings/presenters/catechizing.presenter'
import { ClassroomPresenter } from './classroom.presenter'

export class ClassroomDetailsPresenter {
  static toHTTP(classroom: Classroom) {
    return {
      ...ClassroomPresenter.toHTTP(classroom),
      catechizings: classroom.catechizings.map(CatechizingPresenter.toHTTP),
    }
  }
}
