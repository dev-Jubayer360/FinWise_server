import { Schema, model, Document } from 'mongoose';

export interface IBudget extends Document {
  userId: string;
  category: string;
  monthlyLimit: number;
  spentAmount: number;
}

const budgetSchema = new Schema<IBudget>(
  {
    userId: { type: String, required: true },
    category: { type: String, required: true },
    monthlyLimit: { type: Number, required: true },
    spentAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Budget = model<IBudget>('Budget', budgetSchema);
