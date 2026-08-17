import mongoose, { Schema, Document } from 'mongoose';

export interface IRepository extends Document {
  ownerId: mongoose.Types.ObjectId;
  ownerName: string;
  repoName: string;
  githubRepoId: number;
  fullName: string;
  description?: string;
  url: string;
  language?: string;
  defaultBranch: string;
  isPrivate: boolean;
  starsCount: number;
  forksCount: number;
  openIssuesCount: number;
  syncStatus: 'synced' | 'syncing' | 'failed' | 'pending';
  healthScore: number;
  securityScore: number;
  performanceScore: number;
  maintainabilityScore: number;
  lastSyncedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RepositorySchema: Schema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ownerName: { type: String, required: true },
    repoName: { type: String, required: true },
    githubRepoId: { type: Number, required: true, index: true },
    fullName: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true },
    language: { type: String, default: 'TypeScript' },
    defaultBranch: { type: String, default: 'main' },
    isPrivate: { type: Boolean, default: false },
    starsCount: { type: Number, default: 0 },
    forksCount: { type: Number, default: 0 },
    openIssuesCount: { type: Number, default: 0 },
    syncStatus: { type: String, enum: ['synced', 'syncing', 'failed', 'pending'], default: 'synced' },
    healthScore: { type: Number, default: 85 },
    securityScore: { type: Number, default: 90 },
    performanceScore: { type: Number, default: 82 },
    maintainabilityScore: { type: Number, default: 88 },
    lastSyncedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

RepositorySchema.index({ ownerId: 1, githubRepoId: 1 }, { unique: true });

export const Repository = mongoose.model<IRepository>('Repository', RepositorySchema);
