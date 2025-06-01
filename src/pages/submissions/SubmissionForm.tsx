
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Activity, SubmissionFormProps } from "@/types";
import { FileText } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";

const SubmissionForm: React.FC<SubmissionFormProps> = ({ activityId: propActivityId }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryActivityId = searchParams.get('activityId');
  const { user } = useAuth();
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [reportTitle, setReportTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Use activityId from props or URL query parameter (both optional now)
  const activityId = propActivityId || queryActivityId;

  useEffect(() => {
    // Only fetch activity if activityId is provided
    if (activityId) {
      setLoading(true);
      
      // Fetch activity details
      setTimeout(() => {
        // Mock activity data
        const mockActivity: Activity = {
          id: activityId,
          title: "Week 1: Company Introduction",
          description: "Write a brief introduction about the company you are interning with.",
          startDate: "2025-06-03T10:00:00Z", 
          endDate: "2025-06-10T23:59:59Z",
          deadline: "2025-06-10T23:59:59Z",
          createdAt: "2025-05-01T10:00:00Z",
          createdBy: "2"
        };
        
        setActivity(mockActivity);
        setLoading(false);
      }, 500);
    }
  }, [activityId]);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setFileName(selectedFile.name);
    
    toast({
      title: "File selected",
      description: `${selectedFile.name} (${(selectedFile.size / (1024 * 1024)).toFixed(2)}MB)`,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to submit.",
        variant: "destructive",
      });
      return;
    }

    if (!activityId && !reportTitle.trim()) {
      toast({
        title: "Error",
        description: "Please provide a title for your report.",
        variant: "destructive",
      });
      return;
    }

    // Simulate submission
    setSubmitting(true);
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Your report has been submitted successfully!",
      });
      setSubmitting(false);
      
      // Navigate based on whether activityId was provided
      if (activityId) {
        navigate(`/activities/${activityId}`);
      } else {
        navigate('/dashboard/student');
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 lg:p-6 flex justify-center items-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading activity details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <BackButton to={activityId ? `/activities/${activityId}` : "/dashboard/student"} label={activityId ? "Back to Activity" : "Back to Dashboard"} />
      
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Submit Your Report</CardTitle>
          <CardDescription>
            {activity ? `Upload your report for "${activity.title}"` : "Upload your report"}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {activity && (
            <div>
              <h3 className="text-lg font-medium mb-2">{activity.title}</h3>
              <p className="text-muted-foreground mb-4">{activity.description}</p>
            </div>
          )}

          {!activityId && (
            <div className="grid gap-2">
              <Label htmlFor="reportTitle">Report Title</Label>
              <Input
                id="reportTitle"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                placeholder="Enter a title for your report..."
                className="w-full"
              />
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="file">Upload Your Report</Label>
            <FileUpload 
              onFileSelect={handleFileSelect}
              acceptedFileTypes=".pdf,.docx,.doc,.jpg,.jpeg" 
              maxSize={10}
            />
            {fileName && (
              <div className="mt-4 p-3 bg-muted rounded-md flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{fileName}</p>
                  <p className="text-xs text-muted-foreground">
                    {file && `${(file.size / (1024 * 1024)).toFixed(2)} MB`}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="comments">Additional Comments (Optional)</Label>
            <Textarea
              id="comments"
              placeholder="Any comments you'd like to include with your submission..."
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 sm:flex-row sm:justify-end">
          <Button 
            variant="outline" 
            onClick={() => navigate(activityId ? `/activities/${activityId}` : '/dashboard/student')}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={submitting || !file || (!activityId && !reportTitle.trim())}
            className="w-full sm:w-auto"
          >
            {submitting ? (
              <>
                <span className="animate-spin mr-2">⭘</span> 
                Submitting...
              </>
            ) : (
              "Submit Report"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SubmissionForm;
