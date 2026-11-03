import { Either } from '@/core/either'
import { Formation } from '../../entities/formation'

export type FetchAllFormationsResponseDto = Either<
  null,
  { formations: Formation[] }
>
