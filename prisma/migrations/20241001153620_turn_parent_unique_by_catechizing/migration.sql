/*
  Warnings:

  - A unique constraint covering the columns `[catechizingId]` on the table `parents` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "parents_catechizingId_key" ON "parents"("catechizingId");
