import { Transaction, ITransaction } from './transaction.model';
import QueryBuilder from '../../utils/QueryBuilder';

const createTransaction = async (userId: string, payload: Partial<ITransaction>) => {
  return await Transaction.create({ ...payload, userId });
};

const getTransactions = async (userId: string, query: Record<string, unknown>) => {
  const searchableFields = ['title', 'category', 'notes'];
  
  // Date range filtering
  if (query.startDate || query.endDate) {
    query.transactionDate = {};
    if (query.startDate) {
      (query.transactionDate as any).$gte = new Date(query.startDate as string);
      delete query.startDate;
    }
    if (query.endDate) {
      (query.transactionDate as any).$lte = new Date(query.endDate as string);
      delete query.endDate;
    }
  }

  const transactionQuery = new QueryBuilder(Transaction.find({ userId }), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const data = await transactionQuery.modelQuery;
  const countQuery = new QueryBuilder(Transaction.find({ userId }), query).search(searchableFields).filter();
  const total = await countQuery.modelQuery.countDocuments();
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  return {
    data,
    meta: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
  };
};

const getTransactionById = async (id: string, userId: string) => {
  return await Transaction.findOne({ _id: id, userId });
};

const updateTransaction = async (id: string, userId: string, payload: Partial<ITransaction>) => {
  return await Transaction.findOneAndUpdate({ _id: id, userId }, payload, { new: true, runValidators: true });
};

const deleteTransaction = async (id: string, userId: string) => {
  return await Transaction.findOneAndDelete({ _id: id, userId });
};

export const TransactionService = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
