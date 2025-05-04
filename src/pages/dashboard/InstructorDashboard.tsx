
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Activity, Submission, User, UserRole } from "@/types";
import SummaryStats from "@/components/dashboard/SummaryStats";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivities from "@/components/dashboard/RecentActivities";
import StudentProgress from "@/components/dashboard/StudentProgress";
import RecentSubmissions from "@/components/dashboard/RecentSubmissions";

const InstructorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [students, setStudents] = useState<User[]>([]);

  // Mock data fetch
  useEffect(() => {
    // Simulate fetching activities
    const mockActivities: Activity[] = [
      {
        id: "1",
        title: "Week 1: Company Introduction",
        description: "Write a brief introduction about the company you are interning with.",
        startDate: "2025-06-03T10:00:00Z",
        endDate: "2025-06-10T23:59:59Z",
        createdAt: "2025-05-01T10:00:00Z",
        createdBy: user?.id || "2"
      },
      {
        id: "2",
        title: "Week 2: Department Overview",
        description: "Describe the department you are working in and its role within the company.",
        startDate: "2025-06-10T10:00:00Z",
        endDate: "2025-06-17T23:59:59Z",
        createdAt: "2025-05-01T10:05:00Z",
        createdBy: user?.id || "2"
      },
      {
        id: "3",
        title: "Week 3: Daily Tasks Analysis",
        description: "Document and analyze the daily tasks you are performing.",
        startDate: "2025-06-17T10:00:00Z",
        endDate: "2025-06-24T23:59:59Z",
        createdAt: "2025-05-01T10:10:00Z",
        createdBy: user?.id || "2"
      }
    ];

    // Simulate fetching students
    const mockStudents: User[] = [
      {
        id: "1",
        name: "John Student",
        email: "student@example.com",
        role: UserRole.Student
      },
      {
        id: "4",
        name: "Emma Johnson",
        email: "emma@example.com",
        role: UserRole.Student
      },
      {
        id: "5",
        name: "Michael Smith",
        email: "michael@example.com",
        role: UserRole.Student
      },
      {
        id: "6",
        name: "Sophia Williams",
        email: "sophia@example.com",
        role: UserRole.Student
      }
    ];

    // Simulate fetching submissions
    const mockSubmissions: Submission[] = [
      {
        id: "1",
        activityId: "1",
        studentId: "1",
        fileName: "company_intro.pdf",
        fileUrl: "#",
        submittedAt: "2025-06-08T14:30:00Z",
        status: "reviewed"
      },
      {
        id: "2",
        activityId: "1",
        studentId: "4",
        fileName: "company_intro_emma.pdf",
        fileUrl: "#",
        submittedAt: "2025-06-09T10:15:00Z",
        status: "pending"
      },
      {
        id: "3",
        activityId: "2",
        studentId: "5",
        fileName: "department_overview.docx",
        fileUrl: "#",
        submittedAt: "2025-06-15T16:45:00Z",
        status: "pending"
      }
    ];

    setActivities(mockActivities);
    setStudents(mockStudents);
    setSubmissions(mockSubmissions);
  }, [user]);

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
          <p className="text-muted-foreground">
            Manage practicum activities and monitor student progress
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/activities/create">
            <Button>
              <Plus size={18} className="mr-2" />
              Create New Activity
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Stats */}
      <SummaryStats 
        activities={activities} 
        students={students} 
        submissions={submissions} 
      />

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activities and Student Progress */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="w-full lg:w-2/3">
          <RecentActivities 
            activities={activities}
            submissions={submissions}
            students={students}
          />
        </div>

        <div className="w-full lg:w-1/3">
          <StudentProgress
            students={students}
            activities={activities}
            submissions={submissions}
          />
        </div>
      </div>

      {/* Recent Submissions */}
      <RecentSubmissions
        submissions={submissions}
        activities={activities}
        students={students}
      />
    </div>
  );
};

export default InstructorDashboard;
