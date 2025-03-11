/*
  Warnings:

  - You are about to alter the column `startedAt` on the `classrooms` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "classrooms" ALTER COLUMN "startedAt" SET DATA TYPE INTEGER;
