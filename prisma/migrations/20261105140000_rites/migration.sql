-- CreateTable
CREATE TABLE "rites" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rite_files" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "riteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rite_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rite_files_riteId_idx" ON "rite_files"("riteId");

-- AddForeignKey
ALTER TABLE "rite_files" ADD CONSTRAINT "rite_files_riteId_fkey" FOREIGN KEY ("riteId") REFERENCES "rites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

