-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'student';

-- CreateTable
CREATE TABLE "student_parents" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "parent_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_parents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "student_parents_student_id_idx" ON "student_parents"("student_id");

-- CreateIndex
CREATE INDEX "student_parents_parent_id_idx" ON "student_parents"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_parents_student_id_parent_id_key" ON "student_parents"("student_id", "parent_id");

-- AddForeignKey
ALTER TABLE "student_parents" ADD CONSTRAINT "student_parents_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_parents" ADD CONSTRAINT "student_parents_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
