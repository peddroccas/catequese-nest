-- CreateEnum
CREATE TYPE "Role" AS ENUM ('COORDINATOR', 'MEMBER');

-- AlterTable
ALTER TABLE "catechists" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'MEMBER';
