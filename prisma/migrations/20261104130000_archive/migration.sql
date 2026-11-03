-- AlterTable
ALTER TABLE "catechists" ADD COLUMN     "archivedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "catechizings" ADD COLUMN     "archivedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "classrooms" ADD COLUMN     "archivedAt" TIMESTAMP(3);

