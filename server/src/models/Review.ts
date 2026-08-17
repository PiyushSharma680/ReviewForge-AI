import mongoose, { Schema, Document } from 'mongoose';

export interface IInlineSuggestion {
  filePath?: string;
  lineNumber: number;
  type: 'security' | 'performance' | 'readability' | 'maintainability' | 'naming' | 'architecture';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  issue: string;
  recommendation: string;
  codeSnippet?: string;
  fixedCodeSnippet?: string;
}

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  repoId?: mongoose.Types.ObjectId;
  prNumber?: number;
  commitHash?: string;
  title: string;
  reviewType: 'snippet' | 'file' | 'commit' | 'pr' | 'repository';
  language: string;
  codeSnippet?: string;
  score: number;
  securityScore: number;
  performanceScore: number;
  readabilityScore: number;
  maintainabilityScore: number;
  complexityScore: number;
  summary: string;
  positivePoints: string[];
  suggestions: IInlineSuggestion[];
  securityIssues: string[];
  refactoringIdeas: string[];
  status: 'pending' | 'completed' | 'failed';
  aiModelUsed: string;
  createdAt: Date;
  updatedAt: Date;
}

const InlineSuggestionSchema = new Schema({
  filePath: { type: String },
  lineNumber: { type: Number, required: true },
  type: { type: String, required: true },
  severity: { type: String, enum: ['critical', 'high', 'medium', 'low', 'info'], default: 'medium' },
  issue: { type: String, required: true },
  recommendation: { type: String, required: true },
  codeSnippet: { type: String },
  fixedCodeSnippet: { type: String },
});

const ReviewSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    repoId: { type: Schema.Types.ObjectId, ref: 'Repository', index: true },
    prNumber: { type: Number },
    commitHash: { type: String },
    title: { type: String, required: true },
    reviewType: { type: String, enum: ['snippet', 'file', 'commit', 'pr', 'repository'], default: 'snippet' },
    language: { type: String, default: 'typescript' },
    codeSnippet: { type: String },
    score: { type: Number, default: 80 },
    securityScore: { type: Number, default: 85 },
    performanceScore: { type: Number, default: 80 },
    readabilityScore: { type: Number, default: 85 },
    maintainabilityScore: { type: Number, default: 80 },
    complexityScore: { type: Number, default: 75 },
    summary: { type: String, required: true },
    positivePoints: [{ type: String }],
    suggestions: [InlineSuggestionSchema],
    securityIssues: [{ type: String }],
    refactoringIdeas: [{ type: String }],
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
    aiModelUsed: { type: String, default: 'Gemini-1.5-Pro' },
  },
  {
    timestamps: true,
  }
);

ReviewSchema.index({ createdAt: -1 });

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
