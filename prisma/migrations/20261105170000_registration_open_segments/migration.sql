-- AlterTable
ALTER TABLE "registration_settings" ADD COLUMN     "openSegments" TEXT[] DEFAULT ARRAY['PRE_EUCARISTIA', 'EUCARISTIA', 'CRISMA', 'ADULTOS']::TEXT[];

