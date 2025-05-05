import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const SubmissionForm: React.FC<SubmissionFormProps> = ({ activityId }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!activityId) {
      toast({
        title: "Error",
        description: "Activity ID is required.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Fetch activity details
    setTimeout(() => {
      // Mock activity data
      const mockActivity: Activity = {
        id: activityId || "1",
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
  }, [activityId]);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setFileName(selectedFile.name);
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

    // Simulate submission
    setLoading(true);
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Submission successful!",
      });
      setLoading(false);
      navigate("/activities");
    }, 1000);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 lg:p-6 flex justify-center items-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Submitting your work...</p>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="container mx-auto p-4 lg:p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Activity not found</h2>
          <p className="mt-2 text-muted-foreground">
            The activity you're trying to submit to doesn't exist
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Submit Your Work</CardTitle>
          <CardDescription>
            Upload your file for "{activity.title}"
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="file">Upload File</Label>
            <FileUpload onFileSelect={handleFileSelect} />
            {fileName && (
              <p className="text-sm text-muted-foreground">
                Selected file: {fileName}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SubmissionForm;
