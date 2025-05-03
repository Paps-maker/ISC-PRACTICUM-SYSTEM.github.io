
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Calendar, ChevronRight, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Activity, Submission, UserRole } from "@/types";

const ActivityList: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Mock data fetch
  useEffect(() => {
    // Simulate fetching activities
    const mockActivities: Activity[] = [
      {
        id: "1",
        title: "Week 1: Company Introduction",
        description: "Write a brief introduction about the company you are interning with.",
        deadline: "2025-06-10T23:59:59Z",
        createdAt: "2025-05-01T10:00:00Z",
        createdBy: "2"
      },
      {
        id: "2",
        title: "Week 2: Department Overview",
        description: "Describe the department you are working in and its role within the company.",
        deadline: "2025-06-17T23:59:59Z",
        createdAt: "2025-05-01T10:05:00Z",
        createdBy: "2"
      },
      {
        id: "3",
        title: "Week 3: Daily Tasks Analysis",
        description: "Document and analyze the daily tasks you are performing.",
        deadline: "2025-06-24T23:59:59Z",
        createdAt: "2025-05-01T10:10:00Z",
        createdBy: "2"
      },
      {
        id: "4",
        title: "Week 4: Problem Solving Documentation",
        description: "Document a problem you encountered and how you solved it.",
        deadline: "2025-07-01T23:59:59Z", 
        createdAt: "2025-05-01T10:15:00Z",
        createdBy: "2"
      },
      {
        id: "5",
        title: "Final Report: Overall Experience",
        description: "Summarize your entire practicum experience and what you learned.",
        deadline: "2025-07-15T23:59:59Z",
        createdAt: "2025-05-01T10:20:00Z",
        createdBy: "2"
      }
    ];

    // Simulate fetching submissions
    const mockSubmissions: Submission[] = [];
    
    // Add submission for the current user if they're a student
    if (user && user.role === UserRole.Student) {
      mockSubmissions.push({
        id: "1",
        activityId: "1",
        studentId: user.id,
        fileName: "company_intro.pdf",
        fileUrl: "#",
        submittedAt: "2025-06-08T14:30:00Z",
        status: "reviewed"
      });
    }

    setActivities(mockActivities);
    setSubmissions(mockSubmissions);
  }, [user]);

  // Helper to check if an activity is past due
  const isPastDue = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  // Helper to get the status label and style for an activity
  const getStatusInfo = (activity: Activity) => {
    // Check if there's a submission for this activity by the current user
    const submission = submissions.find(sub => 
      sub.activityId === activity.id && sub.studentId === user?.id
    );
    
    if (submission) {
      return {
        label: submission.status === "reviewed" ? "Reviewed" : "Submitted",
        variant: submission.status === "reviewed" ? "default" : "outline"
      };
    } else if (isPastDue(activity.deadline)) {
      return {
        label: "Overdue",
        variant: "destructive"
      };
    } else {
      return {
        label: "Pending",
        variant: "secondary"
      };
    }
  };

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Practicum Activities</h1>
          <p className="text-muted-foreground">
            View and submit your practicum tasks
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {activities.map((activity) => {
          const { label, variant } = getStatusInfo(activity);
          const deadlineDate = new Date(activity.deadline);
          const isUpcoming = deadlineDate > new Date() && 
            deadlineDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Within next 7 days
          
          return (
            <Card key={activity.id} className={`overflow-hidden ${isPastDue(activity.deadline) && !submissions.some(s => s.activityId === activity.id) ? "border-destructive" : ""}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{activity.title}</CardTitle>
                  <Badge variant={variant}>{label}</Badge>
                </div>
                <CardDescription className="flex items-center text-sm gap-1">
                  <Calendar size={14} />
                  <span>Due: {new Date(activity.deadline).toLocaleDateString()}</span>
                  {isUpcoming && <Badge className="ml-2" variant="outline">Upcoming</Badge>}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{activity.description}</p>
              </CardContent>
              <CardFooter className="pt-3 border-t flex justify-between">
                <div className="text-xs text-muted-foreground flex items-center">
                  <FileText size={14} className="mr-1" />
                  {submissions.some(sub => sub.activityId === activity.id && sub.studentId === user?.id) 
                    ? "Submission received" 
                    : "No submission yet"}
                </div>
                <Link to={`/activities/${activity.id}`}>
                  <Button size="sm" className="gap-1">
                    View
                    <ChevronRight size={16} />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {activities.length === 0 && (
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-muted-foreground">No activities available</h2>
          <p className="mt-2">Check back later for new practicum tasks</p>
        </div>
      )}
    </div>
  );
};

export default ActivityList;
