import { Schema, model, Document } from 'mongoose';

export interface IGoal extends Document {
  userId: string;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
}

const goalSchema = new Schema<IGoal>(
  {
    userId: { type: String, required: true },
    goalName: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    deadline: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Goal = model<IGoal>('Goal', goalSchema);
