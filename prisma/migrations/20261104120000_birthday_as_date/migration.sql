/*
  Datas de nascimento passam a ser apenas data (sem hora/fuso).
  Antes eram gravadas como meia-noite UTC e apareciam um dia antes no
  navegador (UTC-3). O cast mantém o dia que foi digitado.
*/
-- AlterTable
ALTER TABLE "catechists" ALTER COLUMN "birthday" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "catechizings" ALTER COLUMN "birthday" SET DATA TYPE DATE;
