const prisma = require("../db/prisma");
const { decodeId } = require("../utils/idCipher");

function assert(condition, message, status = 400) {
    if (!condition) {
        const err = new Error(message);
        err.status = status;
        throw err;
    }
}

// normalize teacher_id: accept numeric or encoded id
function normalizeTeacherId(val) {
    if (val === undefined || val === null) return null;
    if (typeof val === 'number') return val;
    if (/^\d+$/.test(String(val))) return Number(val);
    const decoded = decodeId(String(val));
    if (decoded === null || Number.isNaN(decoded)) {
        const err = new Error('invalid teacher_id');
        err.status = 400;
        throw err;
    }
    return decoded;
}

exports.list = async () => {
    return await prisma.courses.findMany();
};

exports.getById = async (id) => {
    assert(Number.isFinite(id), 'id must be a number', 400);

    const course = await prisma.courses.findUnique({ where: { id } });
    assert(course, 'Course not found', 404);
    return course;
};

exports.create = async ({ name, code, description, teacher_id }) => {
    assert(typeof name === 'string' && name.trim().length > 0, 'name is required', 400);
    const finalTeacherId = teacher_id !== undefined ? normalizeTeacherId(teacher_id) : undefined;

    if (code) {
        const exists = await prisma.courses.findUnique({ where: { code } });
        assert(!exists, 'code already in use', 400);
    }

    const created = await prisma.courses.create({
        data: {
            name: name.trim(),
            code: code || null,
            description: description || null,
            teacher_id: finalTeacherId || null,
        },
    });

    return created;
};

exports.update = async (id, data) => {
    assert(Number.isFinite(id), 'id must be a number', 400);

    if (data.code) {
        const existing = await prisma.courses.findUnique({ where: { code: data.code } });
        if (existing && existing.id !== id) {
            const err = new Error('code already in use');
            err.status = 400;
            throw err;
        }
    }

    if (data.teacher_id !== undefined) {
        data.teacher_id = normalizeTeacherId(data.teacher_id);
    }

    const updated = await prisma.courses.update({ where: { id }, data });
    return updated;
};

exports.delete = async (id) => {
    assert(Number.isFinite(id), 'id must be a number', 400);
    const deleted = await prisma.courses.delete({ where: { id } });
    return deleted;
};
