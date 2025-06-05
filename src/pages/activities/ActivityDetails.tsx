import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { Activity, Submission, Evaluation, UserRole, SubmissionStatus } from "@/types";
import { Calendar, CheckCircle, Download, FileText, Upload, X } from "lucide-react";
import { format } from "date-fns";

const ActivityDetails: React.FC = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const { user } = useAuth();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch activity details
    setTimeout(() => {
      // Mock activity data
      const mockActivity: Activity = {
        id: activityId || "1",
        title: "Week 1: Company Introduction",
        description: "Write a brief introduction about the company you are interning with. Include the company's history, mission, vision, and core values. Describe the industry in which the company operates and its market position. Also, mention the products or services offered by the company.",
        startDate: "2025-06-03T10:00:00Z",
        endDate: "2025-06-10T23:59:59Z",
        deadline: "2025-06-10T23:59:59Z",
        createdAt: "2025-05-01T10:00:00Z",
        createdBy: "2"
      };
      
      // Mock submission if user is a student
      let mockSubmission: Submission | null = null;
      let mockEvaluation: Evaluation | null = null;
      
      if (user && user.role === UserRole.Student) {
        mockSubmission = {
          id: "1",
          activityId: activityId || "1",
          studentId: user.id,
          fileName: "company_intro.pdf",
          fileUrl: "#",
          submittedAt: "2025-06-08T14:30:00Z",
          status: SubmissionStatus.Reviewed
        };
        
        mockEvaluation = {
          id: "1",
          submissionId: "1",
          evaluatedBy: "3",
          supervisorId: "3",
          grade: 85,
          feedback: "Good effort on describing the company's history and mission. Your analysis of the company's market position is insightful. However, you could elaborate more on the company's core values and how they are applied in daily operations. Also, consider including more specific examples of products or services.",
          evaluatedAt: "2025-06-09T11:20:00Z"
        };
      }
      
      setActivity(mockActivity);
      setSubmission(mockSubmission);
      setEvaluation(mockEvaluation);
      setLoading(false);
    }, 500);
  }, [activityId, user]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 lg:p-6 flex justify-center items-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading activity...</p>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="container mx-auto p-4 lg:p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Activity not found</h2>
          <p className="mt-2 text-muted-foreground">The activity you're looking for doesn't exist</p>
          <Link to="/activities">
            <Button className="mt-4">Back to Activities</Button>
          </Link>
        </div>
      </div>
    );
  }

  const deadline = new Date(activity.deadline);
  const isPastDeadline = deadline < new Date();
  const isSubmitted = submission !== null;
  
  // Get submission status
  const getSubmissionStatus = () => {
    if (!isSubmitted) {
      return isPastDeadline ? {
        label: "Overdue",
        variant: "destructive" as const,
        icon: <X size={16} />
      } : {
        label: "Not Submitted",
        variant: "secondary" as const,
        icon: null
      };
    }
    
    return submission.status === SubmissionStatus.Reviewed ? {
      label: "Reviewed",
      variant: "default" as const,
      icon: <CheckCircle size={16} />
    } : {
      label: "Submitted",
      variant: "outline" as const,
      icon: <CheckCircle size={16} />
    };
  };
  
  const submissionStatus = getSubmissionStatus();

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:justify-between">
          <Link to="/activities">
            <Button variant="outline" size="sm" className="mb-2 md:mb-0">
              Back to Activities
            </Button>
          </Link>
          <Badge variant={submissionStatus.variant} className="w-fit flex items-center gap-1 px-3 py-1">
            {submissionStatus.icon}
            {submissionStatus.label}
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{activity.title}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Calendar size={14} className="text-muted-foreground" />
                <span>Due: {format(new Date(activity.deadline), "MMMM d, yyyy 'at' h:mm a")}</span>
                {isPastDeadline && !isSubmitted && (
                  <Badge variant="destructive" className="ml-2">Overdue</Badge>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p>{activity.description}</p>
              </div>
            </CardContent>
            <CardFooter>
              {user?.role === UserRole.Student && !isSubmitted && (
                <Link to={`/submissions/new?activityId=${activity.id}`} className="w-full">
                  <Button className="w-full flex items-center gap-2">
                    <Upload size={18} />
                    Submit Your Work
                  </Button>
                </Link>
              )}
              {isSubmitted && (
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Download size={18} />
                  Download Your Submission
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
        
        {/* Submission Details */}
        <div className="lg:col-span-1">
          {isSubmitted ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Submission</CardTitle>
                <CardDescription>
                  Submitted on {format(new Date(submission.submittedAt), "MMMM d, yyyy 'at' h:mm a")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={20} className="text-primary" />
                  <span className="font-medium">{submission.fileName}</span>
                </div>
                
                {evaluation && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Evaluation</h3>
                      <div className="mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Grade</span>
                          <Badge variant={evaluation.grade >= 70 ? "default" : "destructive"} className="text-lg px-3 py-1">
                            {evaluation.grade}%
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Feedback</h4>
                        <div className="bg-muted rounded-md p-3 text-sm">
                          {evaluation.feedback}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                {submission.status === SubmissionStatus.Pending && user?.role === UserRole.Student && (
                  <Link to={`/submissions/edit/${submission.id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      Edit Submission
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Submission</CardTitle>
                <CardDescription>
                  No submission yet
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user?.role === UserRole.Student && (
                  <div className="text-center p-6">
                    <Upload size={40} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground mb-4">
                      {isPastDeadline 
                        ? "This activity is past due, but you can still submit" 
                        : "Upload your submission before the deadline"}
                    </p>
                    <Link to={`/submissions/new?activityId=${activity.id}`}>
                      <Button>Submit Your Work</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityDetails;
