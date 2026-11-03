import { Either } from '@/core/either'
import { Catechizing } from '../../entities/catechizing'

export type FetchArchivedCatechizingsResponseDto = Either<
  null,
  { catechizings: Catechizing[] }
>
