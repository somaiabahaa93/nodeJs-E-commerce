class ApiFeatures {
  constructor(mongoQuery, queryString) {
    this.mongoQuery = mongoQuery;
    this.queryString = queryString;
  }

  filter() {
    //1-for filtration using = operators
    const queryStringObj = { ...this.queryString };
    const excludes = ["limit", "page", "fields", "sort"];
    excludes.forEach((field) => delete queryStringObj[field]);
    // console.log("req", queryStringObj);
    //  let mongooseQuery = ProductModel.find(queryStringObj)
    // console.log(this.pro);
    // filtration using [gte,gt,lte,lt]
    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));
    //  let mongooseQuery = ProductModel.find(JSON.parse(queryStr))
    this.mongoQuery = this.mongoQuery.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    // console.log("eq>>>>", this.queryString);
    if (this.queryString.sort) {
      // if sort has more than 1 parameter
      const sortBy = this.queryString.sort.split(",").join(" ");
      // console.log(sortBy);
      this.mongoQuery = this.mongoQuery.sort(sortBy);
    } else {
      this.mongoQuery = this.mongoQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      let { fields } = this.queryString;
      fields = fields.split(",").join(" ");
      // console.log("fields", fields);
      this.mongoQuery = this.mongoQuery.select(fields);
    } else {
      this.mongoQuery = this.mongoQuery.select("-__v");
    }
    return this;
  }

  search(modelName) {
    if (this.queryString.keyword) {
      let query = {};
      if (modelName === "Products") {
        query.$or = [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      } else {
        query = { name: { $regex: this.queryString.keyword, $options: "i" } };
      }

      this.mongoQuery = this.mongoQuery.find(query);
    }
    return this;
  }

  paginate(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    this.mongoQuery = this.mongoQuery.skip(skip).limit(limit);
    const pagination = {};
    const endIndex = page * limit;
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);
    if (countDocuments > endIndex) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.prev = page - 1;
    }
    this.paginationResult = pagination;

    return this;
  }
}

module.exports = ApiFeatures;
