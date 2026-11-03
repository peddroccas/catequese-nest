import { Catechizing } from '@/domain/catechizings/entities/catechizing'
import { ParentPresenter } from './parent.presenter'
import { toDateOnly } from '../../presenters/date.presenter'

export class CatechizingPresenter {
  static toHTTP(catechizing: Catechizing) {
    return {
      id: catechizing.id.toString(),
      name: catechizing.name,
      birthday: toDateOnly(catechizing.birthday),
      address: catechizing.address,
      personWithSpecialNeeds: catechizing.personWithSpecialNeeds,
      releasedToGoAwayAlone: catechizing.releasedToGoAwayAlone,
      specialNeedsDescription: catechizing.specialNeedsDescription,
      maritalStatus: catechizing.maritalStatus,
      livesWithPartner: catechizing.livesWithPartner,
      hasReceivedBaptism: catechizing.hasReceivedBaptism,
      hasReceivedEucharist: catechizing.hasReceivedEucharist,
      hasReceivedMarriage: catechizing.hasReceivedMarriage,
      classroomId: catechizing.classroomId.toString(),
      parents: catechizing.parents.map(ParentPresenter.toHTTP),
      archivedAt: catechizing.archivedAt?.toISOString() ?? null,
    }
  }
}
