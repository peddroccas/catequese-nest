-- CreateTable
CREATE TABLE "meeting_themes" (
    "id" TEXT NOT NULL,
    "itinerary" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "meeting_themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meetings" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "classroomId" TEXT NOT NULL,

    CONSTRAINT "meetings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_attendances" (
    "id" TEXT NOT NULL,
    "isPresent" BOOLEAN NOT NULL,
    "meetingId" TEXT NOT NULL,
    "catechizingId" TEXT NOT NULL,

    CONSTRAINT "meeting_attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MeetingToMeetingTheme" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MeetingToMeetingTheme_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "meeting_themes_itinerary_idx" ON "meeting_themes"("itinerary");

-- CreateIndex
CREATE INDEX "meetings_classroomId_idx" ON "meetings"("classroomId");

-- CreateIndex
CREATE UNIQUE INDEX "meeting_attendances_meetingId_catechizingId_key" ON "meeting_attendances"("meetingId", "catechizingId");

-- CreateIndex
CREATE INDEX "_MeetingToMeetingTheme_B_index" ON "_MeetingToMeetingTheme"("B");

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "classrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_attendances" ADD CONSTRAINT "meeting_attendances_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_attendances" ADD CONSTRAINT "meeting_attendances_catechizingId_fkey" FOREIGN KEY ("catechizingId") REFERENCES "catechizings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MeetingToMeetingTheme" ADD CONSTRAINT "_MeetingToMeetingTheme_A_fkey" FOREIGN KEY ("A") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MeetingToMeetingTheme" ADD CONSTRAINT "_MeetingToMeetingTheme_B_fkey" FOREIGN KEY ("B") REFERENCES "meeting_themes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

