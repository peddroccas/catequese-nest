-- AlterTable
ALTER TABLE "classrooms" ALTER COLUMN "startedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "toBePaid" SET DEFAULT 350;
