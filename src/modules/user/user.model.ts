import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    provider: { type: String, enum: ['email', 'google'], default: 'email' },
  },
  { timestamps: true }
);

export const User = model('User', userSchema);
