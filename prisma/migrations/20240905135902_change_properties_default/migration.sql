-- AlterTable
ALTER TABLE "classrooms" ALTER COLUMN "startedAt" DROP DEFAULT,
ALTER COLUMN "startedAt" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "toBePaid" SET DEFAULT 250;
