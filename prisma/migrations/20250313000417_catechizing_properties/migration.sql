-- AlterTable
ALTER TABLE "catechizings" ADD COLUMN     "hasRecievedCheckbook" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "releasedToGoAwayAlone" BOOLEAN NOT NULL DEFAULT false;
