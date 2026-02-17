-- CreateTable
CREATE TABLE "student_teachers" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_teachers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "student_teachers_student_id_idx" ON "student_teachers"("student_id");

-- CreateIndex
CREATE INDEX "student_teachers_teacher_id_idx" ON "student_teachers"("teacher_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_teachers_student_id_teacher_id_key" ON "student_teachers"("student_id", "teacher_id");

-- AddForeignKey
ALTER TABLE "student_teachers" ADD CONSTRAINT "student_teachers_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_teachers" ADD CONSTRAINT "student_teachers_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
