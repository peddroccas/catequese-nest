/*
  Warnings:

  - Replaces `roomNumber` with `location`. Existing classrooms become 'Sala <roomNumber>'.

*/
-- AlterTable
ALTER TABLE "classrooms" ADD COLUMN "location" TEXT;

-- Migrate data
UPDATE "classrooms"
SET "location" = 'Sala ' || CASE
  WHEN "roomNumber" = trunc("roomNumber") THEN trunc("roomNumber")::bigint::text
  ELSE rtrim(rtrim("roomNumber"::text, '0'), '.')
END;

-- AlterTable
ALTER TABLE "classrooms" ALTER COLUMN "location" SET NOT NULL,
DROP COLUMN "roomNumber";
