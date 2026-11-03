-- CreateTable
CREATE TABLE "formations" (
    "id" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "date" DATE NOT NULL,

    CONSTRAINT "formations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formation_attendances" (
    "id" TEXT NOT NULL,
    "isPresent" BOOLEAN NOT NULL,
    "formationId" TEXT NOT NULL,
    "catechistId" TEXT NOT NULL,

    CONSTRAINT "formation_attendances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "formation_attendances_formationId_catechistId_key" ON "formation_attendances"("formationId", "catechistId");

-- AddForeignKey
ALTER TABLE "formation_attendances" ADD CONSTRAINT "formation_attendances_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "formations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formation_attendances" ADD CONSTRAINT "formation_attendances_catechistId_fkey" FOREIGN KEY ("catechistId") REFERENCES "catechists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
