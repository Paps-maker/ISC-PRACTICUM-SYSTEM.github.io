
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BackButton } from "@/components/ui/back-button";
import { DashboardCardProps } from "@/types";
import { Plus, Users, FileBarChart } from "lucide-react";
import QuickActions from "@/components/dashboard/QuickActions";
import SummaryStats from "@/components/dashboard/SummaryStats";
import RecentActivities from "@/components/dashboard/RecentActivities";
import RecentSubmissions from "@/components/dashboard/RecentSubmissions";
import StudentProgress from "@/components/dashboard/StudentProgress";
import { Activity, Submission, User, UserRole, SubmissionStatus } from "@/types";

const InstructorDashboard: React.FC = () => {
  // Use empty arrays - no mock data
  const mockActivities: Activity[] = [];
  const mockStudents: User[] = [];
  const mockSubmissions: Submission[] = [];

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
      title: "Progress Reports",
      subtitle: "Track student progress and performance",
      content: (
        <p>
          Generate comprehensive reports on student progress, completion rates, and performance metrics across all activities.
        </p>
      ),
      footer: (
        <Link to="/reports">
          <Button>
            <FileBarChart className="mr-2 h-4 w-4" /> View Reports
          </Button>
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
      <BackButton to="/" label="Back to Home" />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
        <p className="text-muted-foreground">
          Manage practicum activities, submissions, and students
        </p>
      </div>

      {/* Summary Statistics */}
      <SummaryStats 
        activities={mockActivities}
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
          submissions={mockSubmissions}
          activities={mockActivities}
          students={mockStudents}
        />
      </div>

      {/* Student Progress */}
      <StudentProgress 
        activities={mockActivities}
        submissions={mockSubmissions}
      />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mt-6">
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
