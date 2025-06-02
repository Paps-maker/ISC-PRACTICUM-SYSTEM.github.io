
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  registrationDate?: string;
}

export enum UserRole {
  Student = "student",
  Instructor = "instructor",
  Supervisor = "supervisor",
  Admin = "admin",
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  deadline?: string;
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

export enum SubmissionStatus {
  Pending = "pending",
  Graded = "graded",
  Late = "late",
  Reviewed = "reviewed",
}

export interface SubmissionFormProps {
  activityId?: string;
}

export interface ManageActivitiesProps {
  activities: Activity[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface DashboardCardProps {
  title: string;
  value?: string | number;
  description?: string;
  icon?: React.ReactNode;
  subtitle?: string;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
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
  type: 'activity' | 'submission' | 'grade';
  read: boolean;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  targetAudience: UserRole[];
  priority: 'low' | 'medium' | 'high';
}
