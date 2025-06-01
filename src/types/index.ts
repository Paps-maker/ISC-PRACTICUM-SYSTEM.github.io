export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
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
}

export interface SubmissionFormProps {
  activityId?: string; // Make activityId optional
}

export interface ManageActivitiesProps {
  activities: Activity[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}
