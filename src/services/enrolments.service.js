const prisma = require("../db/prisma");
const { decodeId } = require("../utils/idCipher");

function assert(condition, message, status = 400) {
    if (!condition) {
        const err = new Error(message);
        err.status = status;
        throw err;
    }
}

function normalizeId(val, name) {
    if (val === undefined || val === null) return null;
    if (typeof val === 'number') return val;
    if (/^\d+$/.test(String(val))) return Number(val);
    const decoded = decodeId(String(val));
    if (decoded === null || Number.isNaN(decoded)) {
        const err = new Error(`invalid ${name}`);
        err.status = 400;
        throw err;
    }
    return decoded;
}

exports.list = async () => {
    return await prisma.enrolments.findMany();
};

exports.getById = async (id) => {
    assert(Number.isFinite(id), 'id must be a number', 400);

    const row = await prisma.enrolments.findUnique({ where: { id } });
    assert(row, 'Enrolment not found', 404);
    return row;
};

exports.create = async ({ student_id, course_id }) => {
    assert(student_id !== undefined && course_id !== undefined, 'student_id and course_id are required', 400);
    const sid = normalizeId(student_id, 'student_id');
    const cid = normalizeId(course_id, 'course_id');

    // ensure user exists and course exists
    const student = await prisma.users.findUnique({ where: { id: sid } });
    assert(student, 'student not found', 404);
    const course = await prisma.courses.findUnique({ where: { id: cid } });
    assert(course, 'course not found', 404);

    // prevent duplicate enrolment
    const exists = await prisma.enrolments.findFirst({ where: { student_id: sid, course_id: cid } });
    assert(!exists, 'student already enrolled in this course', 400);

    const created = await prisma.enrolments.create({ data: { student_id: sid, course_id: cid } });
    return created;
};

exports.update = async (id, data) => {
    assert(Number.isFinite(id), 'id must be a number', 400);

    if (data.student_id !== undefined) data.student_id = normalizeId(data.student_id, 'student_id');
    if (data.course_id !== undefined) data.course_id = normalizeId(data.course_id, 'course_id');

    // If changing to a pair that already exists, prevent duplicate
    if (data.student_id !== undefined || data.course_id !== undefined) {
        const current = await prisma.enrolments.findUnique({ where: { id } });
        assert(current, 'Enrolment not found', 404);
        const newStudent = data.student_id !== undefined ? data.student_id : current.student_id;
        const newCourse = data.course_id !== undefined ? data.course_id : current.course_id;
        const dup = await prisma.enrolments.findFirst({ where: { student_id: newStudent, course_id: newCourse } });
        if (dup && dup.id !== id) {
            const err = new Error('student already enrolled in this course');
            err.status = 400;
            throw err;
        }
    }

    const updated = await prisma.enrolments.update({ where: { id }, data });
    return updated;
};

exports.delete = async (id) => {
    assert(Number.isFinite(id), 'id must be a number', 400);
    const deleted = await prisma.enrolments.delete({ where: { id } });
    return deleted;
};
