import { Schema, model, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  paymentMethod: string;
  notes?: string;
  receiptImage?: string;
  transactionDate: Date;
  aiCategory?: string;
  aiTags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    notes: { type: String },
    receiptImage: { type: String },
    transactionDate: { type: Date, required: true, default: Date.now },
    aiCategory: { type: String },
    aiTags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Transaction = model<ITransaction>('Transaction', transactionSchema);
