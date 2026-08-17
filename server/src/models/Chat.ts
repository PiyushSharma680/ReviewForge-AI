import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage {
  sender: 'user' | 'assistant' | 'system';
  content: string;
  codeSnippet?: string;
  createdAt?: Date;
}

export interface IChat extends Document {
  userId: mongoose.Types.ObjectId;
  repoId?: mongoose.Types.ObjectId;
  title: string;
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema(
  {
    sender: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    codeSnippet: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ChatSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    repoId: { type: Schema.Types.ObjectId, ref: 'Repository' },
    title: { type: String, default: 'AI Code Assistant Session' },
    messages: [ChatMessageSchema],
  },
  {
    timestamps: true,
  }
);

export const Chat = mongoose.model<IChat>('Chat', ChatSchema);
