
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
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { Activity, Submission, UserRole, Evaluation } from "@/types";
import { Calendar, Download, FileText } from "lucide-react";

const SubmissionList: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data fetch
  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
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
        }
      ];

      // Simulate fetching submissions for the current user if they're a student
      const mockSubmissions: Submission[] = [];
      const mockEvaluations: Evaluation[] = [];
      
      if (user && user.role === UserRole.Student) {
        // Add a reviewed submission
        mockSubmissions.push({
          id: "1",
          activityId: "1",
          studentId: user.id,
          fileName: "company_intro.pdf",
          fileUrl: "#",
          submittedAt: "2025-06-08T14:30:00Z",
          status: "reviewed"
        });
        
        // Add the evaluation for the reviewed submission
        mockEvaluations.push({
          id: "1",
          submissionId: "1",
          supervisorId: "3",
          grade: 85,
          feedback: "Good effort, but needs more specific examples.",
          evaluatedAt: "2025-06-09T11:20:00Z"
        });
      }

      setActivities(mockActivities);
      setSubmissions(mockSubmissions);
      setEvaluations(mockEvaluations);
      setIsLoading(false);
    }, 500);
  }, [user]);

  // Helper to find the activity for a submission
  const getActivityForSubmission = (submission: Submission) => {
    return activities.find(activity => activity.id === submission.activityId);
  };
  
  // Helper to find the evaluation for a submission
  const getEvaluationForSubmission = (submission: Submission) => {
    return evaluations.find(evaluation => evaluation.submissionId === submission.id);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 lg:p-6 flex justify-center items-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Submissions</h1>
          <p className="text-muted-foreground">
            Track and manage your practicum submissions
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/activities">
            <Button>
              View Activities
            </Button>
          </Link>
        </div>
      </div>

      {submissions.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Submission History</CardTitle>
            <CardDescription>View all your practicum task submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>Submitted On</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => {
                  const activity = getActivityForSubmission(submission);
                  const evaluation = getEvaluationForSubmission(submission);
                  
                  return (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">
                        {activity?.title || "Unknown Activity"}
                      </TableCell>
                      <TableCell>
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <FileText size={16} />
                          <span className="text-sm">{submission.fileName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={submission.status === "reviewed" ? "default" : "outline"}
                        >
                          {submission.status === "reviewed" ? "Reviewed" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {evaluation ? (
                          <Badge 
                            variant={evaluation.grade >= 70 ? "outline" : "destructive"}
                          >
                            {evaluation.grade}%
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="sm">
                          <Download size={16} className="mr-1" />
                          <span className="sr-only md:not-sr-only">Download</span>
                        </Button>
                        <Link to={`/activities/${submission.activityId}`}>
                          <Button variant="outline" size="sm">
                            <span className="sr-only md:not-sr-only">View</span>
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Submissions Yet</CardTitle>
            <CardDescription>You haven't submitted any work for your practicum activities</CardDescription>
          </CardHeader>
          <CardContent className="text-center p-6">
            <FileText size={64} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-6">
              Start by submitting your work for one of your assigned activities
            </p>
            <Link to="/activities">
              <Button>
                View Activities
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Activities Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Upcoming Deadlines</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activities
            .filter(activity => {
              // Show activities that don't have submissions and are not past deadline
              const hasSubmission = submissions.some(sub => sub.activityId === activity.id);
              const isPastDeadline = new Date(activity.deadline) < new Date();
              return !hasSubmission && !isPastDeadline;
            })
            .slice(0, 3)
            .map(activity => (
              <Card key={activity.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{activity.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>Due: {new Date(activity.deadline).toLocaleDateString()}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-2">{activity.description}</p>
                </CardContent>
                <CardFooter>
                  <Link to={`/submissions/new?activityId=${activity.id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      Submit Work
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}

          {activities.filter(activity => {
            const hasSubmission = submissions.some(sub => sub.activityId === activity.id);
            const isPastDeadline = new Date(activity.deadline) < new Date();
            return !hasSubmission && !isPastDeadline;
          }).length === 0 && (
            <div className="col-span-full text-center p-6">
              <p className="text-muted-foreground">
                No upcoming deadlines. You're all caught up!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionList;
