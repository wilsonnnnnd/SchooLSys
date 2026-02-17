-- AlterTable
ALTER TABLE "enrolments" ADD COLUMN     "enrolled_at" TIMESTAMP(6),
ADD COLUMN     "grade" TEXT,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'enrolled',
ADD COLUMN     "term" TEXT;
