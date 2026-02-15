export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  isFirstTime?: boolean;
  progress?: Progress;
  profile?: Profile;
}

export interface Progress {
  overallReadiness: number;
  dsaScore: number;
  webScore: number;
  dbmsScore: number;
  weakAreas: string[];
  totalSessions: number;
  averageScore: number;
}

export interface Profile {
  phone?: string;
  college?: string;
  degree?: string;
  passingYear?: number;
  targetCompanies?: string[];
  skills?: string[];
}

export interface Assessment {
  _id: string;
  title: string;
  type: 'mcq' | 'coding' | 'interview';
  questions: Question[];
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  isActive: boolean;
  createdBy: {
    _id: string;
    name: string;
  };
}

export interface Question {
  _id: string;
  text: string;
  options?: string[];
  correctAnswer?: any;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  marks: number;
}

export interface Submission {
  _id: string;
  userId: string;
  assessmentId: string | Assessment;
  answers: Answer[];
  score: number;
  totalMarks: number;
  percentage: number;
  timeSpent: number;
  recordingUrl?: string;
  feedback?: Feedback;
  status: 'in_progress' | 'completed' | 'flagged';
  createdAt: string;
}

export interface Answer {
  questionId: string;
  answer: any;
  isCorrect: boolean;
  timeSpent: number;
}

export interface Feedback {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  aiScore?: number;
}

export interface DashboardStats {
  totalUsers: number;
  activeToday: number;
  avgScore: number;
  issues: number;
}
