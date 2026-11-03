import { Catechist } from '@/domain/catechists/entities/catechist'
import { toDateOnly } from '../../presenters/date.presenter'

export class CatechistPresenter {
  static toHTTP(catechist: Catechist) {
    return {
      id: catechist.id.toString(),
      name: catechist.name,
      nickname: catechist.nickname,
      role: catechist.role,
      birthday: toDateOnly(catechist.birthday),
      phone: catechist.phone,
      address: catechist.address,
      email: catechist.email,
      hasReceivedBaptism: catechist.hasReceivedBaptism,
      hasReceivedEucharist: catechist.hasReceivedEucharist,
      hasReceivedConfirmation: catechist.hasReceivedConfirmation,
      hasReceivedMarriage: catechist.hasReceivedMarriage,
      classroomIds: catechist.classroomIds.map(id => id.toString()),
    }
  }
}
