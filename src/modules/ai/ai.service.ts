import { GoogleGenAI, Type } from '@google/genai';
import config from '../../config/env';
import { AIReport } from './ai.model';
import { Transaction } from '../transaction/transaction.model';
import { Budget } from '../budget/budget.model';
import { Goal } from '../goal/goal.model';

const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });

const analyze = async (userId: string) => {
  const transactions = await Transaction.find({ userId });
  const budgets = await Budget.find({ userId });
  const goals = await Goal.find({ userId });

  const prompt = `
    Analyze the following financial data and provide:
    1. Financial Summary
    2. Savings Tips
    3. Risk Analysis
    4. Monthly Advice
    5. Budget Optimization
    6. Financial Health Score (0-100)
    
    Data:
    Transactions: ${JSON.stringify(transactions)}
    Budgets: ${JSON.stringify(budgets)}
    Goals: ${JSON.stringify(goals)}
    
    Format the response in JSON with keys: summary, savingsTips, riskAnalysis, monthlyAdvice, budgetOptimization, financialHealthScore.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-flash-latest',
    contents: prompt,
  });

  const text = response.text || '{}';
  // Attempt to parse JSON from markdown code block if present
  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
  const parsedData = JSON.parse(jsonMatch ? jsonMatch[1] : text);

  return parsedData;
};

const categorize = async (title: string, description: string, merchant: string) => {
  const prompt = `
    Categorize the following transaction:
    Title: ${title}
    Description: ${description || 'N/A'}
    Merchant: ${merchant || 'N/A'}
    
    Provide a JSON response with keys: suggestedCategory (string), tags (array of strings), priority (string: low/medium/high), confidenceScore (number: 0-100).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-flash-latest',
    contents: prompt,
  });

  const text = response.text || '{}';
  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
  const parsedData = JSON.parse(jsonMatch ? jsonMatch[1] : text);

  return parsedData;
};

const generateReport = async (userId: string) => {
  const analysisData = await analyze(userId);
  
  const report = await AIReport.create({
    userId,
    report: JSON.stringify(analysisData),
    score: analysisData.financialHealthScore || 0,
    recommendations: analysisData.savingsTips || [],
  });

  return report;
};

const chatWithAI = async (userId: string, message: string) => {
  const transactions = await Transaction.find({ userId }).sort('-transactionDate').limit(10);
  
  const prompt = `
    You are Finwise AI, a highly intelligent and helpful personal financial advisor.
    The user is asking you a question about their finances or commanding you to add a transaction.
    
    Here is a snapshot of their 10 most recent transactions for context:
    ${JSON.stringify(transactions)}
    
    User message: "${message}"
    
    If the user's message is a command to add or record a transaction (expense or income), you MUST use the 'addTransaction' function.
    Extract the amount, title, type, category, and paymentMethod from their message. 
    If they don't specify a payment method, default to 'Cash'. 
    If they don't specify a category, infer a logical one based on the title.
    
    If it's just a general question, provide a helpful, concise, and professional response without calling any functions.
  `;

  const addTransactionTool = {
    functionDeclarations: [
      {
        name: 'addTransaction',
        description: 'Add a new financial transaction (income or expense) to the database based on the user request.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'A short title or description of the transaction (e.g. "Starbucks Coffee", "Salary")' },
            amount: { type: Type.NUMBER, description: 'The monetary amount of the transaction as a positive number' },
            type: { type: Type.STRING, description: 'Must be either "income" or "expense"' },
            category: { type: Type.STRING, description: 'The category (e.g. "Food", "Transport", "Salary", "Shopping")' },
            paymentMethod: { type: Type.STRING, description: 'The payment method used (e.g. "Cash", "Credit Card", "Bank Transfer")' },
          },
          required: ['title', 'amount', 'type', 'category', 'paymentMethod'],
        },
      },
    ],
  };

  const response = await ai.models.generateContent({
    model: 'gemini-flash-latest',
    contents: prompt,
    config: {
      tools: [addTransactionTool],
    }
  });

  // Check if the AI decided to call a function
  if (response.functionCalls && response.functionCalls.length > 0) {
    const call = response.functionCalls[0];
    
    if (call.name === 'addTransaction') {
      const args = call.args as any;
      
      try {
        // Save to database
        const newTransaction = await Transaction.create({
          userId,
          title: args.title,
          amount: Number(args.amount),
          type: args.type,
          category: args.category,
          paymentMethod: args.paymentMethod,
          transactionDate: new Date(),
        });
        
        // Return a confirmation message to the chat
        return { 
          reply: `✅ I've successfully added the transaction: **${args.title}** for **$${args.amount}** to your ${args.type}s under the '${args.category}' category.` 
        };
      } catch (err) {
        console.error('Error adding transaction via AI:', err);
        return { reply: 'I tried to add the transaction, but there was an error saving it to the database.' };
      }
    }
  }

  // Normal text response
  return { reply: response.text || 'I am sorry, I am unable to process that right now.' };
};

export const AIService = {
  analyze,
  categorize,
  generateReport,
  chatWithAI,
};
