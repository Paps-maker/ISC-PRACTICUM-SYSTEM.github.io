
export enum UserRole {
  Student = "student",
  Instructor = "instructor", 
  Supervisor = "supervisor"
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
