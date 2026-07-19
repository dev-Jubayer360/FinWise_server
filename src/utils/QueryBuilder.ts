import { Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query.searchTerm || this.query.search;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as unknown as any
        ),
      });
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludeFields = ['search', 'searchTerm', 'sort', 'limit', 'page', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering for gte, gt, lte, lt
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    
    this.modelQuery = this.modelQuery.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    let sortStr = '-createdAt'; // default
    if (this.query.sort) {
      const sortMap: Record<string, string> = {
        newest: '-createdAt',
        oldest: 'createdAt',
        'highest amount': '-amount',
        'lowest amount': 'amount',
      };
      
      const sortValue = this.query.sort as string;
      sortStr = sortMap[sortValue] || (this.query.sort as string).split(',').join(' ');
    }
    this.modelQuery = this.modelQuery.sort(sortStr);
    return this;
  }

  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  fields() {
    if (this.query.fields) {
      const fields = (this.query.fields as string).split(',').join(' ');
      this.modelQuery = this.modelQuery.select(fields);
    } else {
      this.modelQuery = this.modelQuery.select('-__v');
    }
    return this;
  }
}

export default QueryBuilder;
