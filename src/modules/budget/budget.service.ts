import { Budget, IBudget } from './budget.model';

const createBudget = async (userId: string, payload: Partial<IBudget>) => {
  return await Budget.create({ ...payload, userId });
};

const getBudgets = async (userId: string) => {
  return await Budget.find({ userId });
};

const updateBudget = async (id: string, userId: string, payload: Partial<IBudget>) => {
  return await Budget.findOneAndUpdate({ _id: id, userId }, payload, { new: true, runValidators: true });
};

const deleteBudget = async (id: string, userId: string) => {
  return await Budget.findOneAndDelete({ _id: id, userId });
};

export const BudgetService = {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
};
