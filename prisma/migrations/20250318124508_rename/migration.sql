/*
  Warnings:

  - You are about to drop the column `hasRecievedCheckbook` on the `catechizings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "catechizings" DROP COLUMN "hasRecievedCheckbook";

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "hasReceivedBooklet" BOOLEAN NOT NULL DEFAULT false;
