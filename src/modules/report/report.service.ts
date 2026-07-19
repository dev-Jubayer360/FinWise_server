import { Transaction } from '../transaction/transaction.model';
import { Goal } from '../goal/goal.model';
import { Budget } from '../budget/budget.model';

const getDashboardData = async (userId: string) => {
  const transactions = await Transaction.find({ userId }).sort('-transactionDate');
  const goals = await Goal.find({ userId }).sort('deadline').limit(5);
  const budgets = await Budget.find({ userId });

  let totalIncome = 0;
  let totalExpense = 0;
  let monthlyIncome = 0;
  let monthlyExpense = 0;
  const categoryDistribution: Record<string, number> = {};

  const monthlyDataMap: Record<string, { income: number; expense: number }> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthKey = d.toLocaleString('en-US', { month: 'short' });
    monthlyDataMap[monthKey] = { income: 0, expense: 0 };
  }

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  transactions.forEach((t) => {
    if (t.type === 'income') totalIncome += t.amount;
    else if (t.type === 'expense') {
      totalExpense += t.amount;
      categoryDistribution[t.category] = (categoryDistribution[t.category] || 0) + t.amount;
    }

    const tDate = new Date(t.transactionDate);
    const mKey = tDate.toLocaleString('en-US', { month: 'short' });
    
    if (monthlyDataMap[mKey] !== undefined) {
      const msIn6Months = 6 * 31 * 24 * 60 * 60 * 1000;
      if (Date.now() - tDate.getTime() <= msIn6Months) {
        if (t.type === 'income') monthlyDataMap[mKey].income += t.amount;
        else if (t.type === 'expense') monthlyDataMap[mKey].expense += t.amount;
      }
    }

    if (tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) {
      if (t.type === 'income') monthlyIncome += t.amount;
      else if (t.type === 'expense') monthlyExpense += t.amount;
    }
  });

  const monthlyData = Object.entries(monthlyDataMap).map(([m, data]) => ({
    m,
    income: data.income,
    expense: data.expense,
  }));

  const currentBalance = totalIncome - totalExpense;
  const savings = totalIncome > totalExpense ? totalIncome - totalExpense : 0;
  const recentTransactions = transactions.slice(0, 5);

  return {
    totalIncome,
    totalExpense,
    currentBalance,
    savings,
    monthlyIncome,
    monthlyExpense,
    categoryDistribution,
    recentTransactions,
    upcomingGoals: goals,
    budgets,
    monthlyData,
  };
};

export const ReportService = {
  getDashboardData,
};
