import { Schema, model, Document } from 'mongoose';

export interface IAIReport extends Document {
  userId: string;
  report: string;
  score: number;
  recommendations: string[];
  createdAt: Date;
}

const aiReportSchema = new Schema<IAIReport>(
  {
    userId: { type: String, required: true },
    report: { type: String, required: true },
    score: { type: Number, required: true },
    recommendations: { type: [String], default: [] },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AIReport = model<IAIReport>('AIReport', aiReportSchema);
