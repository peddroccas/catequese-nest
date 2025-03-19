import { Either } from '@/core/either'
import { Catechist } from '../../entities/catechist'

export type FetchAllCatechistResponseDto = Either<
  null,
  { catechists: Catechist[] | null }
>
