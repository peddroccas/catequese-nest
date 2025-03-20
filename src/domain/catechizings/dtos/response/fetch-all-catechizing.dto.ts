import { Either } from '@/core/either'
import { Catechizing } from '../../entities/catechizing'

export type FetchAllCatechizingResponseDto = Either<
  null,
  { catechizings: Catechizing[] | null }
>
