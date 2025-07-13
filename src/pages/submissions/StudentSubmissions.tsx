
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BackButton } from "@/components/ui/back-button";
import { useAuth } from "@/contexts/AuthContext";
import { Activity, Submission, SubmissionStatus, UserRole } from "@/types";
import { Calendar, FileText, Edit, Upload, Eye } from "lucide-react";

const StudentSubmissions: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const getDashboardUrl = () => {
    if (!user) return "/";
    
    switch (user.role) {
      case UserRole.Student:
        return "/dashboard/student";
      case UserRole.Instructor:
        return "/dashboard/instructor";
      case UserRole.Supervisor:
        return "/dashboard/supervisor";
      default:
        return "/";
    }
  };

  useEffect(() => {
    // Mock data fetch - replace with actual API calls
    setTimeout(() => {
      // No mock data - use empty arrays
      const mockActivities: Activity[] = [];
      const mockSubmissions: Submission[] = [];

      setActivities(mockActivities);
      setSubmissions(mockSubmissions);
      setLoading(false);
    }, 500);
  }, [user]);

  const getSubmissionForActivity = (activityId: string) => {
    return submissions.find(sub => sub.activityId === activityId);
  };

  const getActivityStatus = (activity: Activity) => {
    const submission = getSubmissionForActivity(activity.id);
    const now = new Date();
    const deadline = new Date(activity.deadline || activity.endDate);
    
    if (submission) {
      return {
        status: submission.status === SubmissionStatus.Reviewed ? 'Reviewed' : 'Submitted',
        color: submission.status === SubmissionStatus.Reviewed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
      };
    } else if (deadline < now) {
      return {
        status: 'Overdue',
        color: 'bg-red-100 text-red-800'
      };
    } else {
      return {
        status: 'Not Started',
        color: 'bg-gray-100 text-gray-800'
      };
    }
  };

  const completionRate = activities.length > 0 
    ? Math.round((submissions.length / activities.length) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="container mx-auto p-4 lg:p-6 flex justify-center items-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading your submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <BackButton to={getDashboardUrl()} label="Back to Dashboard" />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Submissions</h1>
        <p className="text-muted-foreground">
          Track and manage your practicum submissions
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Progress Overview</CardTitle>
          <CardDescription>Your overall completion status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Completion Progress</span>
            <span className="text-sm text-muted-foreground">
              {submissions.length} of {activities.length} activities completed
            </span>
          </div>
          <Progress value={completionRate} className="h-3" />
          <div className="mt-2 text-center">
            <span className="text-2xl font-bold text-primary">{completionRate}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <div className="space-y-4">
        {activities.map(activity => {
          const submission = getSubmissionForActivity(activity.id);
          const activityStatus = getActivityStatus(activity);
          const deadline = new Date(activity.deadline || activity.endDate);
          
          return (
            <Card key={activity.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{activity.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {activity.description}
                    </CardDescription>
                  </div>
                  <Badge className={activityStatus.color}>
                    {activityStatus.status}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  Deadline: {deadline.toLocaleDateString()}
                </div>
              </CardHeader>
              <CardContent>
                {submission ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                      <FileText className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">{submission.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          Submitted on {new Date(submission.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {submission.grade && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                        <p className="font-medium text-green-800">Grade: {submission.grade}/100</p>
                        {submission.feedback && (
                          <p className="text-sm text-green-700 mt-1">{submission.feedback}</p>
                        )}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Link to={`/submissions/edit/${submission.id}`}>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit Submission
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground mb-4">No submission yet</p>
                    <Link to={`/activities/${activity.id}`}>
                      <Button>
                        <Upload className="h-4 w-4 mr-1" />
                        Submit Report
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {activities.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Activities Yet</h3>
            <p className="text-muted-foreground">
              Your instructor hasn't created any activities yet. Check back later!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentSubmissions;
