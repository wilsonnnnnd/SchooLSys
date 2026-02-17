const CoursesService = require("../services/courses.service");
const { encodeId } = require("../utils/idCipher");

exports.list = async (req, res, next) => {
    try {
        const courses = await CoursesService.list();
        const safe = courses.map((c) => {
            if (!c) return c;
            if (c.id) c.id = encodeId(c.id);
            return c;
        });
        res.json(safe);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const course = await CoursesService.getById(id);
        if (course && course.id) course.id = encodeId(course.id);
        res.json(course);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const { name, code, description, teacher_id } = req.body;
        const created = await CoursesService.create({ name, code, description, teacher_id });
        if (created && created.id) created.id = encodeId(created.id);
        res.status(201).json(created);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const data = req.body;
        const updated = await CoursesService.update(id, data);
        if (updated && updated.id) updated.id = encodeId(updated.id);
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        await CoursesService.delete(id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};
