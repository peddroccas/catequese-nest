-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RegistrationDocumentKind" AS ENUM ('PERSON_ID', 'GUARDIAN_ID', 'PROOF_OF_RESIDENCE', 'BAPTISM', 'EUCHARIST', 'MARRIAGE');

-- AlterTable
ALTER TABLE "catechizings" ADD COLUMN     "foodRestriction" TEXT,
ADD COLUMN     "pickupAuthorizedBy" TEXT,
ADD COLUMN     "shirtSize" TEXT;

-- CreateTable
CREATE TABLE "registrations" (
    "id" TEXT NOT NULL,
    "segment" TEXT NOT NULL,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'PENDING',
    "name" TEXT NOT NULL,
    "birthday" DATE NOT NULL,
    "address" TEXT NOT NULL,
    "personWithSpecialNeeds" BOOLEAN NOT NULL,
    "specialNeedsDescription" TEXT,
    "foodRestriction" TEXT,
    "releasedToGoAwayAlone" BOOLEAN NOT NULL DEFAULT false,
    "pickupAuthorizedBy" TEXT,
    "shirtSize" TEXT,
    "hasReceivedBaptism" BOOLEAN NOT NULL,
    "hasReceivedEucharist" BOOLEAN NOT NULL,
    "hasReceivedMarriage" BOOLEAN NOT NULL DEFAULT false,
    "maritalStatus" TEXT,
    "livesWithPartner" BOOLEAN,
    "parents" JSONB NOT NULL,
    "rejectionReason" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "catechizingId" TEXT,
    "termsAcceptedAt" TIMESTAMP(3) NOT NULL,
    "submitterHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registration_files" (
    "id" TEXT NOT NULL,
    "kind" "RegistrationDocumentKind" NOT NULL,
    "storagePath" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "registrationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registration_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registration_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "isOpen" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registration_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "registrations_catechizingId_key" ON "registrations"("catechizingId");

-- CreateIndex
CREATE INDEX "registrations_status_createdAt_idx" ON "registrations"("status", "createdAt");

-- CreateIndex
CREATE INDEX "registrations_name_birthday_idx" ON "registrations"("name", "birthday");

-- CreateIndex
CREATE UNIQUE INDEX "registration_files_registrationId_kind_key" ON "registration_files"("registrationId", "kind");

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "catechists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_catechizingId_fkey" FOREIGN KEY ("catechizingId") REFERENCES "catechizings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registration_files" ADD CONSTRAINT "registration_files_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

