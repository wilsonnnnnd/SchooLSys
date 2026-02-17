/*
  Warnings:

  - Added the required column `updated_at` to the `student_parents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `student_teachers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "student_parents" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL;

-- AlterTable
ALTER TABLE "student_teachers" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "updated_at" DROP DEFAULT;
