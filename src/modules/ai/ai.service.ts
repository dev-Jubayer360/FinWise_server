import { GoogleGenAI } from '@google/genai';
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
    The user is asking you a question about their finances.
    
    Here is a snapshot of their 10 most recent transactions for context:
    ${JSON.stringify(transactions)}
    
    User message: "${message}"
    
    Please provide a helpful, concise, and professional response. Do not use markdown code blocks for the entire response, just write normally. You can use markdown formatting like bolding and lists.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-flash-latest',
    contents: prompt,
  });

  return { reply: response.text || 'I am sorry, I am unable to process that right now.' };
};

export const AIService = {
  analyze,
  categorize,
  generateReport,
  chatWithAI,
};
