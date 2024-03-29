const advancedResults = (model, populate) => async (req, res, next) => {
  let query;
  // Copy req.query
  const reqQuery = { ...req.query };
  // Fields to exclude
  const removeFields = ["keyword", "select", "sort", "page", "limit"];
  // Loop over removed fields and delete them from reqQuery
  removeFields.forEach((field) => delete reqQuery[field]);
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

  query = model.find(JSON.parse(queryStr));

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};
  query = model.find({ ...keyword });

  // Select Fields
  // if (req.query.select) {
  //   const selectedFields = req.query.select.split(",").join(" ");
  //   query = query.select(selectedFields);
  // }
  // // Sort fields
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(",").join(" ");
  //   // console.log(sortBy);
  //   query = query.sort(sortBy);
  // } else {
  //   query = query.sort("-createdAt");
  // }
  //pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments({ ...keyword });
  // const total = await model.countDocuments();
  // if (req.query.keyword) {
  //   await query;
  //    total = total.length;
  //   console.log({ total: total.length });
  // }
  query = query.skip(startIndex).limit(limit);

  // Populate
  if (populate) {
    query = query.populate(populate);
  }

  const results = await query;

  // pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = { page: page + 1, limit };
  }
  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit };
  }
  res.advancedResults = {
    success: true,
    count: results.length,
    totalCount: total,
    pages: Math.ceil(total / limit),
    pagination,
    data: results,
  };
  next();
};
module.exports = advancedResults;
