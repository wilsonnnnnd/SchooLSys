const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Attach lightweight audit wrappers to model methods (create/update/delete/upsert)
// This avoids relying on a specific Prisma middleware API and works by
// monkey-patching model operation functions to inject audit fields when the
// model defines them in the DMMF.
function attachAuditWrappers(client) {
	if (!client || !client._dmmf || !client._dmmf.modelMap) return;

	const models = Object.keys(client._dmmf.modelMap);
	const nowProvider = () => new Date();

	for (const modelName of models) {
		const modelMeta = client._dmmf.modelMap[modelName];
		if (!modelMeta) continue;
		const fieldNames = modelMeta.fields.map((f) => f.name);
		const has = (n) => fieldNames.includes(n);

		const modelClient = client[modelName];
		if (!modelClient) continue;

		const wrap = (origFn, wrapper) => {
			const bound = origFn.bind(modelClient);
			const newFn = function (args) {
				return wrapper(bound, args);
			};
			// preserve function name
			Object.defineProperty(newFn, 'name', { value: origFn.name, writable: false });
			return newFn;
		};

		// create
		if (modelClient.create) {
			modelClient.create = wrap(modelClient.create, async (orig, args = {}) => {
				const now = nowProvider();
				if (!args.data) args.data = {};
				if (has('created_at') && args.data.created_at === undefined) args.data.created_at = now;
				if (has('updated_at')) args.data.updated_at = now;
				if (has('enabled') && args.data.enabled === undefined) args.data.enabled = true;
				return orig(args);
			});
		}

		// createMany
		if (modelClient.createMany) {
			modelClient.createMany = wrap(modelClient.createMany, async (orig, args = {}) => {
				const now = nowProvider();
				if (Array.isArray(args.data)) {
					args.data = args.data.map((d) => {
						if (has('created_at') && d.created_at === undefined) d.created_at = now;
						if (has('updated_at') && d.updated_at === undefined) d.updated_at = now;
						if (has('enabled') && d.enabled === undefined) d.enabled = true;
						return d;
					});
				}
				return orig(args);
			});
		}

		// update / updateMany
		if (modelClient.update) {
			modelClient.update = wrap(modelClient.update, async (orig, args = {}) => {
				if (!args.data) args.data = {};
				if (has('updated_at')) args.data.updated_at = nowProvider();
				return orig(args);
			});
		}
		if (modelClient.updateMany) {
			modelClient.updateMany = wrap(modelClient.updateMany, async (orig, args = {}) => {
				if (!args.data) args.data = {};
				if (has('updated_at')) args.data.updated_at = nowProvider();
				return orig(args);
			});
		}

		// upsert
		if (modelClient.upsert) {
			modelClient.upsert = wrap(modelClient.upsert, async (orig, args = {}) => {
				if (args.create) {
					const now = nowProvider();
					if (has('created_at') && args.create.created_at === undefined) args.create.created_at = now;
					if (has('updated_at')) args.create.updated_at = now;
					if (has('enabled') && args.create.enabled === undefined) args.create.enabled = true;
				}
				if (!args.update) args.update = {};
				if (has('updated_at')) args.update.updated_at = nowProvider();
				return orig(args);
			});
		}

        // delete -> convert to soft-delete update when possible
		if (modelClient.delete) {
			modelClient.delete = wrap(modelClient.delete, async (orig, args = {}) => {
				if (has('deleted') || has('enabled') || has('updated_at')) {
					const data = {};
					if (has('deleted')) data.deleted = true;
					if (has('enabled')) data.enabled = false;
					if (has('updated_at')) data.updated_at = nowProvider();
					// call update instead
					return modelClient.update({ where: args.where, data });
				}
				return orig(args);
			});
		}
	}
}

// Attach wrappers
try {
	attachAuditWrappers(prisma);
} catch (e) {
	console.warn('[prisma.audit] failed to attach audit wrappers', e && e.message ? e.message : e);
}

module.exports = prisma;
