/*
  Warnings:

  - Made the column `roomNumber` on table `classrooms` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `startedAt` on the `classrooms` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "classrooms" ALTER COLUMN "roomNumber" SET NOT NULL,
DROP COLUMN "startedAt",
ADD COLUMN     "startedAt" DECIMAL(65,30) NOT NULL;
