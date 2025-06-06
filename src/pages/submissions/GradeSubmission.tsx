
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Download, Save, ChevronLeft, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Activity, Submission, User, UserRole, SubmissionStatus } from "@/types";
import { BackButton } from "@/components/ui/back-button";
import { notificationStore } from "@/stores/notificationStore";

const GradeSubmission: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [student, setStudent] = useState<User | null>(null);
  const [grade, setGrade] = useState<number>(70);
  const [feedback, setFeedback] = useState<string>("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Extract submission ID from URL if available
  const submissionId = location.pathname.split("/").pop();
  
  // Mock data fetch
  useEffect(() => {
    // Simulate API call to fetch submission data
    setTimeout(() => {
      // Mock submission data
      const mockSubmission: Submission = {
        id: submissionId || "1",
        activityId: "1",
        studentId: "1",
        fileName: "weekly_report.pdf",
        fileUrl: "#",
        submittedAt: new Date().toISOString(),
        status: SubmissionStatus.Pending
      };

      // Mock activity data
      const mockActivity: Activity = {
        id: "1",
        title: "Week 1: Company Introduction",
        description: "Write a brief introduction about the company you are interning with.",
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: "2"
      };

      // Mock student data
      const mockStudent: User = {
        id: "1",
        name: "John Student",
        email: "student@example.com",
        role: UserRole.Student
      };

      setSubmission(mockSubmission);
      setActivity(mockActivity);
      setStudent(mockStudent);
      setLoading(false);
    }, 1000);
  }, [submissionId]);

  // Only supervisors should access this page
  useEffect(() => {
    if (user && user.role !== UserRole.Supervisor) {
      toast({
        title: "Access denied",
        description: "Only supervisors can grade submissions.",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [user, navigate, toast]);

  const handleSubmitGrade = () => {
    // In a real app, this would send the grade to the API
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Send notification to student
      if (student && activity) {
        notificationStore.notifyStudentOfGrade(
          student.id,
          activity.title,
          grade,
          feedback
        );
      }

      toast({
        title: "Submission graded",
        description: `You've successfully graded the submission with ${grade}%. The student has been notified.`,
      });
      
      // Update local state to reflect the submission being reviewed
      setSubmission(prev => 
        prev ? { ...prev, status: SubmissionStatus.Reviewed, grade, feedback } : null
      );
      
      setLoading(false);
      
      // Navigate back to the submissions list
      navigate("/submissions/grade");
    }, 1500);
  };

  const handleDownloadSubmission = () => {
    // In a real app, this would download the actual file
    toast({
      title: "Download started",
      description: `Downloading ${submission?.fileName}...`,
    });
    // Mock download - in real app would trigger actual file download
    console.log(`Downloading file: ${submission?.fileName}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <BackButton to="/dashboard/supervisor" label="Back to Dashboard" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Submission details */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Submission Details</CardTitle>
                  <CardDescription>
                    {activity?.title}
                  </CardDescription>
                </div>
                <Badge variant={submission?.status === SubmissionStatus.Reviewed ? "default" : "secondary"}>
                  {submission?.status === SubmissionStatus.Reviewed ? "Reviewed" : "Pending Review"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Student</h3>
                <p>{student?.name} ({student?.email})</p>
              </div>
              
              <div>
                <h3 className="font-medium">Submission Date</h3>
                <p>{submission && new Date(submission.submittedAt).toLocaleString()}</p>
              </div>
              
              <div>
                <h3 className="font-medium">Activity Description</h3>
                <p className="text-muted-foreground">{activity?.description}</p>
              </div>
              
              <div>
                <h3 className="font-medium">Submitted File</h3>
                <div className="flex items-center gap-2 mt-2 p-3 border rounded-md bg-muted/50">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="flex-grow">{submission?.fileName}</span>
                  <div className="flex gap-2">
                    <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle>View Submission: {submission?.fileName}</DialogTitle>
                          <DialogDescription>
                            Submitted by {student?.name} for {activity?.title}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 p-4 border rounded-lg bg-muted/20 h-96 overflow-auto">
                          <div className="text-center text-muted-foreground">
                            <FileText className="h-16 w-16 mx-auto mb-4" />
                            <p className="text-lg font-medium mb-2">File Preview</p>
                            <p className="text-sm mb-4">
                              In a real application, this would show the actual content of the submitted file.
                            </p>
                            <div className="text-left bg-background p-4 rounded border">
                              <h4 className="font-semibold mb-2">Sample Content Preview:</h4>
                              <p className="text-sm leading-relaxed">
                                This is a mock preview of the submitted document. In a real implementation, 
                                you would integrate with document viewers like:
                              </p>
                              <ul className="text-sm mt-2 ml-4 list-disc">
                                <li>PDF.js for PDF files</li>
                                <li>Google Docs Viewer API</li>
                                <li>Microsoft Office Online for Word/Excel files</li>
                                <li>Custom text readers for plain text files</li>
                              </ul>
                              <p className="text-sm mt-3 text-muted-foreground">
                                File: {submission?.fileName}<br/>
                                Submitted: {submission && new Date(submission.submittedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm" onClick={handleDownloadSubmission}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>

              {/* Show existing grade and feedback if already reviewed */}
              {submission?.status === SubmissionStatus.Reviewed && (
                <div className="mt-4 p-4 border rounded-lg bg-green-50">
                  <h3 className="font-medium text-green-800 mb-2">Previous Grade & Feedback</h3>
                  <div className="space-y-2">
                    <p><strong>Grade:</strong> {submission.grade}/100</p>
                    {submission.feedback && (
                      <div>
                        <strong>Feedback:</strong>
                        <p className="text-sm mt-1 text-muted-foreground">{submission.feedback}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Grading form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Grade Submission</CardTitle>
              <CardDescription>
                Provide feedback and assign a grade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="grade">Grade (%)</Label>
                  <span className="text-lg font-semibold">{grade}%</span>
                </div>
                <Slider
                  id="grade"
                  min={0}
                  max={100}
                  step={1}
                  defaultValue={[grade]}
                  onValueChange={(value) => setGrade(value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Provide feedback on the submission..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={5}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleSubmitGrade}
                disabled={submission?.status === SubmissionStatus.Reviewed}
              >
                <Save className="mr-2 h-4 w-4" />
                {submission?.status === SubmissionStatus.Reviewed ? "Already Graded" : "Submit Grade"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GradeSubmission;
