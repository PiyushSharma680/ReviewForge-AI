import mongoose, { Schema, Document } from 'mongoose';

export interface ISavedPrompt extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  promptText: string;
  category: 'security' | 'performance' | 'refactoring' | 'react' | 'backend' | 'custom';
  isPublic: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const SavedPromptSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    promptText: { type: String, required: true },
    category: {
      type: String,
      enum: ['security', 'performance', 'refactoring', 'react', 'backend', 'custom'],
      default: 'custom',
    },
    isPublic: { type: Boolean, default: false },
    usageCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const SavedPrompt = mongoose.model<ISavedPrompt>('SavedPrompt', SavedPromptSchema);
