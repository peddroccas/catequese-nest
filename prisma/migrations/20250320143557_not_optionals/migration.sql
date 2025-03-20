/*
  Warnings:

  - Made the column `hasReceivedMarriage` on table `catechists` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `catechists` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password_hash` on table `catechists` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "catechists" ALTER COLUMN "hasReceivedMarriage" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "password_hash" SET NOT NULL;
