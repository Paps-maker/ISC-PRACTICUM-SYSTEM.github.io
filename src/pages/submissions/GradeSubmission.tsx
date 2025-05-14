
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
import { FileText, Download, Save, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Activity, Submission, User, UserRole } from "@/types";

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
        status: "pending"
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
      toast({
        title: "Submission graded",
        description: `You've successfully graded the submission with ${grade}%.`,
      });
      
      // Update local state to reflect the submission being reviewed
      setSubmission(prev => 
        prev ? { ...prev, status: "reviewed" } : null
      );
      
      setLoading(false);
      
      // Navigate back to the submissions list
      navigate("/submissions/grade");
    }, 1500);
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
      <Button 
        variant="ghost" 
        onClick={() => navigate("/submissions/grade")}
        className="mb-6"
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to submissions
      </Button>
      
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
                <Badge variant={submission?.status === "reviewed" ? "default" : "secondary"}>
                  {submission?.status === "reviewed" ? "Reviewed" : "Pending Review"}
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
                  <span>{submission?.fileName}</span>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
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
                disabled={submission?.status === "reviewed"}
              >
                <Save className="mr-2 h-4 w-4" />
                {submission?.status === "reviewed" ? "Already Graded" : "Submit Grade"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GradeSubmission;
