import { Either } from '@/core/either'
import { Catechist } from '../../entities/catechist'

export type FetchArchivedCatechistsResponseDto = Either<
  null,
  { catechists: Catechist[] }
>
