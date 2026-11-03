import { Catechizing } from '@/domain/catechizings/entities/catechizing'
import { ParentPresenter } from './parent.presenter'

export class CatechizingPresenter {
  static toHTTP(catechizing: Catechizing) {
    return {
      id: catechizing.id.toString(),
      name: catechizing.name,
      birthday: catechizing.birthday,
      address: catechizing.address,
      personWithSpecialNeeds: catechizing.personWithSpecialNeeds,
      releasedToGoAwayAlone: catechizing.releasedToGoAwayAlone,
      hasReceivedBaptism: catechizing.hasReceivedBaptism,
      hasReceivedEucharist: catechizing.hasReceivedEucharist,
      hasReceivedMarriage: catechizing.hasReceivedMarriage,
      classroomId: catechizing.classroomId.toString(),
      parents: catechizing.parents.map(ParentPresenter.toHTTP),
    }
  }
}
