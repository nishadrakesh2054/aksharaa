const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const buildSearchFilter = (q, fields = []) => {
  if (!q || !fields.length) return {};
  const safeQuery = String(q).trim().slice(0, 80);
  if (!safeQuery) return {};
  const regex = new RegExp(escapeRegex(safeQuery), "i");
  return {
    $or: fields.map((field) => ({ [field]: regex })),
  };
};

const buildSort = (req, defaultSort = { createdAt: -1 }) => {
  const sortBy = req.query.sortBy;
  if (!sortBy) return defaultSort;
  if (!/^[a-zA-Z0-9_.]+$/.test(String(sortBy))) return defaultSort;

  const sortOrder = String(req.query.sortOrder || "desc").toLowerCase() === "asc" ? 1 : -1;
  return { [sortBy]: sortOrder };
};

const buildSelect = (fields) => {
  if (!fields) return null;
  if (Array.isArray(fields)) return fields.join(" ");
  return String(fields)
    .split(",")
    .map((field) => field.trim())
    .filter((field) => /^[a-zA-Z0-9_.-]+$/.test(field))
    .join(" ");
};

const paginatedFind = async ({
  model,
  req,
  filter = {},
  searchFields = [],
  defaultSort = { createdAt: -1 },
  populate = null,
  useTextSearch = false,
  select = null,
}) => {
  const q = String(req.query.q || req.query.search || "").trim().slice(0, 80);
  const page = parsePositiveInt(req.query.page, 1);
  const limit = Math.min(parsePositiveInt(req.query.limit, 50), 100);
  const shouldPaginate = req.query.page !== undefined || req.query.limit !== undefined;
  const textSearchEnabled = Boolean(q && useTextSearch);
  const searchFilter = textSearchEnabled
    ? { $text: { $search: String(q).trim() } }
    : buildSearchFilter(q, searchFields);
  let finalFilter = { ...filter, ...searchFilter };

  const executeQuery = async (withTextSearch = textSearchEnabled) => {
    let query = model.find(finalFilter);
    const selectedFields = buildSelect(select || req.query.fields);
    if (selectedFields) query = query.select(selectedFields);
    if (withTextSearch && !req.query.sortBy) {
      query = query.sort({ score: { $meta: "textScore" }, ...defaultSort });
    } else {
      query = query.sort(buildSort(req, defaultSort));
    }
    if (populate) query = query.populate(populate);
    if (shouldPaginate) query = query.skip((page - 1) * limit).limit(limit);

    return Promise.all([
      query.lean(),
      model.countDocuments(finalFilter),
    ]);
  };

  let items;
  let total;
  try {
    [items, total] = await executeQuery();
  } catch (error) {
    if (!textSearchEnabled || !/text index/i.test(error.message || "")) {
      throw error;
    }
    finalFilter = { ...filter, ...buildSearchFilter(q, searchFields) };
    [items, total] = await executeQuery(false);
  }

  return {
    items,
    total,
    pagination: {
      page: shouldPaginate ? page : 1,
      limit: shouldPaginate ? limit : total,
      total,
      pages: shouldPaginate ? Math.ceil(total / limit) || 1 : 1,
      hasNextPage: shouldPaginate ? page * limit < total : false,
      hasPrevPage: shouldPaginate ? page > 1 : false,
    },
  };
};

module.exports = {
  paginatedFind,
};
