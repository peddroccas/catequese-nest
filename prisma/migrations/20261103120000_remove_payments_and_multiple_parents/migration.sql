/*
  Warnings:

  - Drops the `payments` and `installments` tables. All booklet payment data will be lost.
  - A catechizing can now have more than one parent.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_catechizingId_fkey";

-- DropForeignKey
ALTER TABLE "installments" DROP CONSTRAINT "installments_paymentId_fkey";

-- DropIndex
DROP INDEX "parents_catechizingId_key";

-- DropTable
DROP TABLE "payments";

-- DropTable
DROP TABLE "installments";

