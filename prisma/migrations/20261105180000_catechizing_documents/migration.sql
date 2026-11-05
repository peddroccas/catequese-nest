-- CreateTable
CREATE TABLE "catechizing_documents" (
    "id" TEXT NOT NULL,
    "kind" "RegistrationDocumentKind" NOT NULL,
    "storagePath" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "catechizingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "catechizing_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "catechizing_documents_catechizingId_kind_key" ON "catechizing_documents"("catechizingId", "kind");

-- AddForeignKey
ALTER TABLE "catechizing_documents" ADD CONSTRAINT "catechizing_documents_catechizingId_fkey" FOREIGN KEY ("catechizingId") REFERENCES "catechizings"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Quem já tinha sido aprovado ganha os documentos da inscrição no próprio
-- perfil (só copia as linhas: os arquivos continuam onde estão no bucket)
INSERT INTO "catechizing_documents" ("id", "kind", "storagePath", "originalName", "mimeType", "sizeBytes", "catechizingId", "createdAt")
SELECT f."id", f."kind", f."storagePath", f."originalName", f."mimeType", f."sizeBytes", r."catechizingId", f."createdAt"
FROM "registration_files" f
JOIN "registrations" r ON r."id" = f."registrationId"
WHERE r."catechizingId" IS NOT NULL;
