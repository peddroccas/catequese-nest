import { Segment } from '@/domain/classroms/enums/segment'

// Itinerário de temas que cada segmento de turma segue
export enum Itinerary {
  PRE_EUCARISTIA = 'Pré-Eucaristia',
  EUCARISTIA = 'Eucaristia',
  CRISMA = 'Crisma',
  ADULTOS = 'Adultos',
}

export const SEGMENT_ITINERARY: Record<Segment, Itinerary> = {
  [Segment.PRE_EUCARISTIA]: Itinerary.PRE_EUCARISTIA,
  [Segment.EUCARISTIA_1]: Itinerary.EUCARISTIA,
  [Segment.EUCARISTIA_2]: Itinerary.EUCARISTIA,
  [Segment.CRISMA_1]: Itinerary.CRISMA,
  [Segment.CRISMA_2]: Itinerary.CRISMA,
  [Segment.CATEQUESE_ADULTOS]: Itinerary.ADULTOS,
}
