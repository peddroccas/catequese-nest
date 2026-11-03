/*
  Um catequista pode estar em várias turmas.
  A turma atual de cada catequista é copiada para a tabela de relação
  antes de remover a coluna "classroomId".
*/
-- CreateTable
CREATE TABLE "_CatechistToClassroom" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CatechistToClassroom_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CatechistToClassroom_B_index" ON "_CatechistToClassroom"("B");

-- AddForeignKey
ALTER TABLE "_CatechistToClassroom" ADD CONSTRAINT "_CatechistToClassroom_A_fkey" FOREIGN KEY ("A") REFERENCES "catechists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CatechistToClassroom" ADD CONSTRAINT "_CatechistToClassroom_B_fkey" FOREIGN KEY ("B") REFERENCES "classrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate data
INSERT INTO "_CatechistToClassroom" ("A", "B")
SELECT "id", "classroomId" FROM "catechists" WHERE "classroomId" IS NOT NULL;

-- DropForeignKey
ALTER TABLE "catechists" DROP CONSTRAINT "catechists_classroomId_fkey";

-- AlterTable
ALTER TABLE "catechists" DROP COLUMN "classroomId";
