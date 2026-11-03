export enum Segment {
  EUCARISTIA_1 = 'Eucaristia 1',
  EUCARISTIA_2 = 'Eucaristia 2',
  CRISMA_1 = 'Crisma 1',
  CRISMA_2 = 'Crisma 2',
  CATEQUESE_ADULTOS = 'Catequese Adultos',
  CATECUMENOS_ADULTOS = 'Catecúmenos Adultos',
  CATEQUIZANDOS_ADULTOS = 'Catequizandos Adultos',
}

export const ADULT_SEGMENTS: Segment[] = [
  Segment.CATEQUESE_ADULTOS,
  Segment.CATECUMENOS_ADULTOS,
  Segment.CATEQUIZANDOS_ADULTOS,
]
