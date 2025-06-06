
export enum UserRole {
  Student = "student",
  Instructor = "instructor", 
  Supervisor = "supervisor",
  Admin = "admin"
}

export enum SubmissionStatus {
  Pending = "pending",
  Reviewed = "reviewed",
  Graded = "graded"
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  schoolId?: string;
  registrationDate?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  deadline: string;
  createdAt: string;
  createdBy: string;
}

export interface Submission {
  id: string;
  activityId: string;
  studentId: string;
  fileName: string;
  fileUrl: string;
  submittedAt: string;
  status: SubmissionStatus;
  grade?: number;
  feedback?: string;
}

export interface Evaluation {
  id: string;
  submissionId: string;
  grade: number;
  feedback: string;
  evaluatedBy: string;
  evaluatedAt: string;
  supervisorId?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'activity' | 'grade' | 'general';
  read: boolean;
  createdAt: string;
}

export interface DashboardCardProps {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole, schoolId?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
  priority: 'low' | 'medium' | 'high';
  targetRole?: UserRole;
}

export interface SubmissionFormProps {
  activityId: string;
  onSubmissionSuccess: () => void;
}
