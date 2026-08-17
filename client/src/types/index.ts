export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'developer' | 'owner';
  githubUsername?: string;
}

export interface Repository {
  _id: string;
  ownerName: string;
  repoName: string;
  githubRepoId: number;
  fullName: string;
  description?: string;
  url: string;
  language: string;
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
  lastSyncedAt?: string;
}

export interface InlineSuggestion {
  filePath?: string;
  lineNumber: number;
  type: 'security' | 'performance' | 'readability' | 'maintainability' | 'naming' | 'architecture';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  issue: string;
  recommendation: string;
  codeSnippet?: string;
  fixedCodeSnippet?: string;
}

export interface Review {
  _id: string;
  userId: string;
  repoId?: Repository;
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
  suggestions: InlineSuggestion[];
  securityIssues: string[];
  refactoringIdeas: string[];
  status: 'pending' | 'completed' | 'failed';
  aiModelUsed: string;
  createdAt: string;
}

export interface DashboardStats {
  repositoryCount: number;
  reviewCount: number;
  averageScore: number;
  securityScore: number;
  performanceScore: number;
  maintainabilityScore: number;
  technicalDebtScore: number;
  recentReviews: Review[];
  repositories: Repository[];
  weeklyTrends: {
    day: string;
    reviews: number;
    securityScore: number;
    qualityScore: number;
  }[];
}
