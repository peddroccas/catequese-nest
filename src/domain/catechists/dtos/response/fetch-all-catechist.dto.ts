import { Either } from '@/core/either'
import { Catechist } from '../../entities/catechist'

export type FetchAllCatechistsResponseDto = Either<
  null,
  { catechists: Catechist[] | null }
>
