import { Either } from '@/core/either'
import { Catechizing } from '../../entities/catechizing'

export type FetchAllCatechizingsResponseDto = Either<
  null,
  { catechizings: Catechizing[] | null }
>
