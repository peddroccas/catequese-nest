// Datas sem hora (nascimento, formação) saem como 'AAAA-MM-DD' para o front
// não converter para o fuso local e mostrar o dia anterior
export function toDateOnly(date: Date) {
  return date.toISOString().slice(0, 10)
}
