/*
  Warnings:

  - Made the column `classroomId` on table `catechizings` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "catechizings" ALTER COLUMN "classroomId" SET NOT NULL;
