

export enum UserRole {
  Student = "student",
  Instructor = "instructor",
  Supervisor = "supervisor"
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  registrationDate?: string; // Adding registrationDate property as optional
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  deadline?: string; // Adding deadline property as optional
  createdAt: string;
  createdBy: string;
}

export interface Submission {
  id: string;
  activityId: string;
  studentId: string;
  fileName?: string; // Making fileName optional
  fileUrl: string;
  submittedAt: string;
  feedback?: string; // Adding feedback property as optional
  grade?: number; // Adding grade property as optional
  status: "pending" | "reviewed";
}

export interface Evaluation {
  id: string;
  submissionId: string;
  supervisorId: string;
  grade: number;
  feedback: string;
  evaluatedAt: string;
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
  subtitle?: string;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export interface SubmissionFormProps {
  activityId: string;
}

export interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: string;
  maxSize?: number;
}

