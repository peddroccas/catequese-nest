import { Rite } from '@/domain/rites/entities/rite'

export class RitePresenter {
  static toHTTP(rite: Rite) {
    return {
      id: rite.id.toString(),
      name: rite.name,
      description: rite.description,
      files: rite.files.map(file => ({
        id: file.id,
        name: file.name,
        url: file.url,
      })),
    }
  }
}
