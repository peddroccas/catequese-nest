-- DropForeignKey
ALTER TABLE "catechizings" DROP CONSTRAINT "catechizings_classroomId_fkey";

-- AddForeignKey
ALTER TABLE "catechizings" ADD CONSTRAINT "catechizings_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "classrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
