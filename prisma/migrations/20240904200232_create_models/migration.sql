-- CreateTable
CREATE TABLE "catechists" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "hasReceivedBaptism" BOOLEAN NOT NULL,
    "hasReceivedEucharist" BOOLEAN NOT NULL,
    "hasReceivedConfirmation" BOOLEAN NOT NULL,
    "hasReceivedMarriage" BOOLEAN,
    "email" TEXT,
    "password_hash" TEXT,
    "classroomId" TEXT,

    CONSTRAINT "catechists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catechizings" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "age" DECIMAL(65,30),
    "address" TEXT NOT NULL,
    "personWithSpecialNeeds" BOOLEAN,
    "hasReceivedBaptism" BOOLEAN NOT NULL,
    "hasReceivedEucharist" BOOLEAN NOT NULL,
    "hasReceivedMarriage" BOOLEAN NOT NULL DEFAULT false,
    "classroomId" TEXT,

    CONSTRAINT "catechizings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "kinship" TEXT NOT NULL,
    "catechizingId" TEXT NOT NULL,

    CONSTRAINT "parents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classrooms" (
    "id" TEXT NOT NULL,
    "roomNumber" DECIMAL(65,30),
    "segment" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "classrooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "toBePaid" DOUBLE PRECISION NOT NULL DEFAULT 150,
    "hasReceivedTicket" BOOLEAN NOT NULL DEFAULT false,
    "catechizingId" TEXT NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "installments" (
    "id" TEXT NOT NULL,
    "payedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" DOUBLE PRECISION NOT NULL,
    "paymentId" TEXT NOT NULL,

    CONSTRAINT "installments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "catechists_email_key" ON "catechists"("email");

-- CreateIndex
CREATE UNIQUE INDEX "classrooms_roomNumber_key" ON "classrooms"("roomNumber");

-- CreateIndex
CREATE UNIQUE INDEX "payments_catechizingId_key" ON "payments"("catechizingId");

-- AddForeignKey
ALTER TABLE "catechists" ADD CONSTRAINT "catechists_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "classrooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catechizings" ADD CONSTRAINT "catechizings_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "classrooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parents" ADD CONSTRAINT "parents_catechizingId_fkey" FOREIGN KEY ("catechizingId") REFERENCES "catechizings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_catechizingId_fkey" FOREIGN KEY ("catechizingId") REFERENCES "catechizings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installments" ADD CONSTRAINT "installments_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
