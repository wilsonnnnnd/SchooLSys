const EnrolmentsService = require('../services/enrolments.service');
const { encodeId } = require('../utils/idCipher');

exports.list = async (req, res, next) => {
    try {
        const rows = await EnrolmentsService.list();
        const safe = rows.map(r => {
            if (!r) return r;
            if (r.id) r.id = encodeId(r.id);
            return r;
        });
        res.json(safe);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const row = await EnrolmentsService.getById(id);
        if (row && row.id) row.id = encodeId(row.id);
        res.json(row);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const { student_id, course_id } = req.body;
        const created = await EnrolmentsService.create({ student_id, course_id });
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
        const updated = await EnrolmentsService.update(id, data);
        if (updated && updated.id) updated.id = encodeId(updated.id);
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        await EnrolmentsService.delete(id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};
