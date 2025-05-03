
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Activity } from "@/types";
import { AlertTriangle, Calendar, FileText, Upload, X } from "lucide-react";
import { format } from "date-fns";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  acceptedFileTypes?: string;
  maxSizeInMB?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect,
  acceptedFileTypes = ".pdf,.docx,.doc",
  maxSizeInMB = 10
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files && e.target.files[0];
    
    if (!file) {
      setSelectedFile(null);
      onFileSelect(null);
      return;
    }
    
    // Validate file type
    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFileTypes.includes(`.${fileType}`)) {
      setError(`Invalid file type. Please upload a ${acceptedFileTypes.replace(/,/g, ' or ')} file.`);
      setSelectedFile(null);
      onFileSelect(null);
      return;
    }
    
    // Validate file size
    if (file.size > maxSizeInMB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSizeInMB}MB.`);
      setSelectedFile(null);
      onFileSelect(null);
      return;
    }
    
    setSelectedFile(file);
    onFileSelect(file);
  };
  
  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
  
  return (
    <div className="w-full">
      {!selectedFile ? (
        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
          <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
          <div className="mb-2">
            <p className="font-medium">Click to upload or drag and drop</p>
            <p className="text-sm text-muted-foreground">
              PDF or DOCX (max {maxSizeInMB}MB)
            </p>
          </div>
          <Input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={acceptedFileTypes}
            onChange={handleFileChange}
            id="file-upload"
          />
          <Label htmlFor="file-upload">
            <Button variant="outline" type="button">
              Select File
            </Button>
          </Label>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium truncate max-w-[200px] sm:max-w-xs">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFile}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-2 text-destructive text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

const SubmissionForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get("activityId");
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [activity, setActivity] = useState<Activity | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Simulate fetching activity details if activityId is provided
    if (activityId) {
      // Mock activity data
      setTimeout(() => {
        const mockActivity: Activity = {
          id: activityId,
          title: "Week 1: Company Introduction",
          description: "Write a brief introduction about the company you are interning with.",
          deadline: "2025-06-10T23:59:59Z",
          createdAt: "2025-05-01T10:00:00Z",
          createdBy: "2"
        };
        setActivity(mockActivity);
      }, 300);
    }
  }, [activityId]);
  
  const isPastDeadline = activity ? new Date(activity.deadline) < new Date() : false;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }
    
    if (!activity) {
      toast({
        title: "Error",
        description: "No activity selected for submission",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate file upload and submission
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Your work has been submitted successfully",
      });
      
      setIsSubmitting(false);
      
      // Navigate to activity details page
      navigate(`/activities/${activity.id}`);
    }, 1500);
  };
  
  return (
    <div className="container mx-auto p-4 lg:p-6">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:justify-between">
          <Link to={activityId ? `/activities/${activityId}` : "/activities"}>
            <Button variant="outline" size="sm" className="mb-2 md:mb-0">
              Back
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submission Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Submit Your Work</CardTitle>
                <CardDescription>
                  Upload your submission for {activity?.title || "this activity"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isPastDeadline && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Late Submission</AlertTitle>
                    <AlertDescription>
                      This submission is past the deadline. It may be subject to penalties according to the course policy.
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Upload Your File</Label>
                  <FileUpload onFileSelect={setFile} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="comments">Comments (Optional)</Label>
                  <textarea 
                    id="comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Add any additional comments about your submission"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting || !file}
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                      Submitting...
                    </>
                  ) : (
                    <>Submit</>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
        
        {/* Activity Details */}
        {activity && (
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{activity.title}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Calendar size={14} className="text-muted-foreground" />
                  <span>Due: {format(new Date(activity.deadline), "MMMM d, yyyy")}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{activity.description}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionForm;
