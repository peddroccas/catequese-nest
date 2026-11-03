import { Parent } from '@/domain/catechizings/entities/parent'

export class ParentPresenter {
  static toHTTP(parent: Parent) {
    return {
      id: parent.id.toString(),
      name: parent.name,
      phone: parent.phone,
      kinship: parent.kinship,
    }
  }
}
