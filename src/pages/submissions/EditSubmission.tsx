import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileUpload } from "@/components/FileUpload";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Activity, Submission, SubmissionStatus } from "@/types";
import { FileText } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";

const EditSubmission: React.FC = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!submissionId) {
      toast({
        title: "Error",
        description: "Submission ID is required.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Fetch submission and activity details
    setTimeout(() => {
      // Mock submission data
      const mockSubmission: Submission = {
        id: submissionId || "1",
        activityId: "1",
        studentId: user?.id || "1",
        fileName: "company_intro_v1.pdf",
        fileUrl: "#",
        submittedAt: "2025-06-08T14:30:00Z",
        status: SubmissionStatus.Pending
      };

      // Mock activity data
      const mockActivity: Activity = {
        id: "1",
        title: "Week 1: Company Introduction",
        description: "Write a brief introduction about the company you are interning with.",
        startDate: "2025-06-03T10:00:00Z", 
        endDate: "2025-06-10T23:59:59Z",
        deadline: "2025-06-10T23:59:59Z",
        createdAt: "2025-05-01T10:00:00Z",
        createdBy: "2"
      };
      
      setSubmission(mockSubmission);
      setActivity(mockActivity);
      setFileName(mockSubmission.fileName);
      setLoading(false);
    }, 500);
  }, [submissionId, user]);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setFileName(selectedFile.name);
    
    toast({
      title: "New file selected",
      description: `${selectedFile.name} (${(selectedFile.size / (1024 * 1024)).toFixed(2)}MB)`,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Simulate submission update
    setSubmitting(true);
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Your report has been updated successfully!",
      });
      setSubmitting(false);
      navigate(`/activities/${activity?.id}`);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 lg:p-6 flex justify-center items-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading submission details...</p>
        </div>
      </div>
    );
  }

  if (!submission || !activity) {
    return (
      <div className="container mx-auto p-4 lg:p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Submission not found</h2>
          <p className="mt-2 text-muted-foreground">
            The submission you're trying to edit doesn't exist
          </p>
          <Button className="mt-4" onClick={() => navigate('/activities')}>
            Back to Activities
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <BackButton to={`/activities/${activity.id}`} label="Back to Activity" />
      
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Your Report</CardTitle>
          <CardDescription>
            Update your submission for "{activity.title}"
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">{activity.title}</h3>
            <p className="text-muted-foreground mb-4">{activity.description}</p>
          </div>

          <div className="grid gap-2">
            <Label>Current Submission</Label>
            <div className="p-3 bg-muted rounded-md flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{submission.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  Submitted on {new Date(submission.submittedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="file">Replace Your Report (Optional)</Label>
            <FileUpload 
              onFileSelect={handleFileSelect}
              acceptedFileTypes=".pdf,.docx,.doc,.jpg,.jpeg" 
              maxSize={10}
            />
            {file && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">New file: {fileName}</p>
                  <p className="text-xs text-green-600">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="comments">Additional Comments (Optional)</Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Any comments about the changes you made..."
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 sm:flex-row sm:justify-end">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/activities/${activity.id}`)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={submitting}
            className="w-full sm:w-auto"
          >
            {submitting ? (
              <>
                <span className="animate-spin mr-2">⭘</span> 
                Updating...
              </>
            ) : (
              "Update Submission"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EditSubmission;
