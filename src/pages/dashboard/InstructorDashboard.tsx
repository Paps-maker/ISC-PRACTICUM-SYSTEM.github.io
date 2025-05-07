
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCardProps } from "@/types";
import { Plus, Users } from "lucide-react";
import QuickActions from "@/components/dashboard/QuickActions";
import SummaryStats from "@/components/dashboard/SummaryStats";
import RecentActivities from "@/components/dashboard/RecentActivities";
import RecentSubmissions from "@/components/dashboard/RecentSubmissions";
import StudentProgress from "@/components/dashboard/StudentProgress";
import { Activity, Submission, User, UserRole } from "@/types";

const InstructorDashboard: React.FC = () => {
  // Mock data for dashboard
  const mockActivities: Activity[] = [
    {
      id: "1",
      title: "Week 1: Company Introduction",
      description: "Write a brief introduction about the company you are interning with.",
      startDate: "2025-06-01T10:00:00Z",
      endDate: "2025-06-07T23:59:59Z",
      deadline: "2025-06-07T23:59:59Z",
      createdAt: "2025-05-01T10:00:00Z",
      createdBy: "2"
    },
    {
      id: "2",
      title: "Week 2: Department Functions",
      description: "Document the functions of different departments in your organization.",
      startDate: "2025-06-08T10:00:00Z",
      endDate: "2025-06-14T23:59:59Z",
      deadline: "2025-06-14T23:59:59Z",
      createdAt: "2025-05-01T10:30:00Z",
      createdBy: "2"
    },
    {
      id: "3",
      title: "Week 3: Tools and Technologies",
      description: "List and describe the tools and technologies used in your work.",
      startDate: "2025-06-15T10:00:00Z",
      endDate: "2025-06-21T23:59:59Z",
      deadline: "2025-06-21T23:59:59Z",
      createdAt: "2025-05-02T09:15:00Z",
      createdBy: "2"
    }
  ];

  const mockStudents: User[] = [
    { 
      id: "1", 
      name: "John Student", 
      email: "student@example.com", 
      role: UserRole.Student
    },
    { 
      id: "4", 
      name: "Alice Cooper", 
      email: "alice@example.com", 
      role: UserRole.Student
    },
    { 
      id: "5", 
      name: "Bob Johnson", 
      email: "bob@example.com", 
      role: UserRole.Student
    },
  ];

  const mockSubmissions: Submission[] = [
    {
      id: "1",
      activityId: "1",
      studentId: "1",
      fileName: "file1.pdf",
      fileUrl: "https://example.com/file1.pdf",
      submittedAt: "2025-06-05T15:30:00Z",
      status: "pending"
    },
    {
      id: "2",
      activityId: "1",
      studentId: "4",
      fileName: "file2.pdf",
      fileUrl: "https://example.com/file2.pdf",
      submittedAt: "2025-06-06T10:45:00Z",
      status: "reviewed"
    },
    {
      id: "3",
      activityId: "2",
      studentId: "5",
      fileName: "file3.pdf",
      fileUrl: "https://example.com/file3.pdf",
      submittedAt: "2025-06-12T09:20:00Z",
      status: "pending"
    }
  ];

  // Feature cards for quick access
  const cards: DashboardCardProps[] = [
    {
      title: "Manage Activities",
      subtitle: "Create, edit, and view practicum activities",
      content: (
        <p>
          Oversee all activities assigned to students. Ensure activities are well-defined and aligned with learning objectives.
        </p>
      ),
      footer: (
        <Link to="/activities/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Activity
          </Button>
        </Link>
      ),
    },
    {
      title: "View Submissions",
      subtitle: "Review and evaluate student submissions",
      content: (
        <p>
          Access a list of student submissions for each activity. Provide feedback and grades to evaluate student performance.
        </p>
      ),
      footer: (
        <Link to="/submissions">
          <Button>View Submissions</Button>
        </Link>
      ),
    },
    {
      title: "Manage Students",
      subtitle: "View and manage student accounts",
      content: (
        <p>
          View a list of registered students. Manage student accounts and ensure all students have access to the necessary resources.
        </p>
      ),
      footer: (
        <Link to="/students">
          <Button>
            <Users className="mr-2 h-4 w-4" /> View Students
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
        <p className="text-muted-foreground">
          Manage practicum activities, submissions, and students
        </p>
      </div>

      {/* Summary Statistics */}
      <SummaryStats 
        activities={mockActivities}
        students={mockStudents}
        submissions={mockSubmissions}
      />

      {/* Quick Actions */}
      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Activities */}
        <RecentActivities 
          activities={mockActivities}
          submissions={mockSubmissions}
          students={mockStudents}
        />

        {/* Recent Submissions */}
        <RecentSubmissions 
          submissions={mockSubmissions.slice(0, 5)}
          activities={mockActivities}
          students={mockStudents}
        />
      </div>

      {/* Student Progress */}
      <StudentProgress 
        students={mockStudents}
        activities={mockActivities}
        submissions={mockSubmissions}
      />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {cards.map((card, index) => (
          <Card key={index} className="h-full">
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.subtitle}</CardDescription>
            </CardHeader>
            <CardContent>{card.content}</CardContent>
            {card.footer && <CardContent>{card.footer}</CardContent>}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InstructorDashboard;
