import { Goal, IGoal } from './goal.model';

const createGoal = async (userId: string, payload: Partial<IGoal>) => {
  return await Goal.create({ ...payload, userId });
};

const getGoals = async (userId: string) => {
  return await Goal.find({ userId });
};

const updateGoal = async (id: string, userId: string, payload: Partial<IGoal>) => {
  return await Goal.findOneAndUpdate({ _id: id, userId }, payload, { new: true, runValidators: true });
};

const deleteGoal = async (id: string, userId: string) => {
  return await Goal.findOneAndDelete({ _id: id, userId });
};

export const GoalService = {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
};
