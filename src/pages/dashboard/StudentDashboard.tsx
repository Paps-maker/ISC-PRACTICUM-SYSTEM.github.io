
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/ui/back-button";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { useAuth } from "@/contexts/AuthContext";
import { Activity, Submission, SubmissionStatus } from "@/types";
import { Calendar, CheckCircle, Clock, FileText, Upload, TrendingUp, Download, File } from "lucide-react";

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [attachmentLetter, setAttachmentLetter] = useState<{
    fileName: string;
    fileUrl: string;
    uploadedAt: string;
  } | null>(null);

  // Mock data fetch
  useEffect(() => {
    // Simulate fetching activities
    const mockActivities: Activity[] = [
      {
        id: "1",
        title: "Week 1: Company Introduction",
        description: "Write a brief introduction about the company you are interning with.",
        startDate: "2025-06-03T10:00:00Z",
        endDate: "2025-06-10T23:59:59Z",
        deadline: "2025-06-10T23:59:59Z",
        createdAt: "2025-05-01T10:00:00Z",
        createdBy: "2"
      },
      {
        id: "2",
        title: "Week 2: Department Overview",
        description: "Describe the department you are working in and its role within the company.",
        startDate: "2025-06-10T10:00:00Z",
        endDate: "2025-06-17T23:59:59Z",
        deadline: "2025-06-17T23:59:59Z",
        createdAt: "2025-05-01T10:05:00Z",
        createdBy: "2"
      },
      {
        id: "3",
        title: "Week 3: Daily Tasks Analysis",
        description: "Document and analyze the daily tasks you are performing.",
        startDate: "2025-06-17T10:00:00Z",
        endDate: "2025-06-24T23:59:59Z",
        deadline: "2025-06-24T23:59:59Z",
        createdAt: "2025-05-01T10:10:00Z",
        createdBy: "2"
      }
    ];

    const mockSubmissions: Submission[] = [
      {
        id: "1",
        activityId: "1",
        studentId: user?.id || "1",
        fileName: "company_intro.pdf",
        fileUrl: "#",
        submittedAt: "2025-06-08T14:30:00Z",
        status: SubmissionStatus.Reviewed
      }
    ];

    setActivities(mockActivities);
    setSubmissions(mockSubmissions);

    // Check if student is eligible for attachment letter and has one uploaded
    const completedActivities = mockSubmissions.filter(s => 
      s.status === SubmissionStatus.Reviewed || s.status === SubmissionStatus.Graded
    ).length;
    
    const isEligible = completedActivities === mockActivities.length;
    
    // Mock attachment letter for eligible student (John Student)
    if (isEligible && user?.id === "1") {
      setAttachmentLetter({
        fileName: "attachment_letter_john.pdf",
        fileUrl: "#",
        uploadedAt: "2025-06-06T10:00:00Z"
      });
    }
  }, [user]);

  // Calculate upcoming deadlines
  const upcomingActivities = activities
    .filter(activity => {
      const hasSubmission = submissions.some(
        sub => sub.activityId === activity.id
      );
      
      return !hasSubmission && new Date(activity.deadline || activity.endDate) > new Date();
    })
    .sort((a, b) => new Date(a.deadline || a.endDate).getTime() - new Date(b.deadline || b.endDate).getTime())
    .slice(0, 3);

  const submittedActivities = activities.filter(activity => {
    return submissions.some(sub => sub.activityId === activity.id);
  });

  const submissionRate = activities.length > 0
    ? Math.round((submittedActivities.length / activities.length) * 100)
    : 0;

  const recentSubmissions = [...submissions]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 3);

  const downloadAttachmentLetter = () => {
    if (attachmentLetter) {
      const element = document.createElement('a');
      element.setAttribute('href', attachmentLetter.fileUrl);
      element.setAttribute('download', attachmentLetter.fileName);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <BackButton to="/" label="Back to Home" />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground">
          Here's an overview of your practicum progress
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <DashboardCard
          title="Completion Progress"
          content={
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-4xl font-bold text-primary mb-2">
                {submissionRate}%
              </div>
              <div className="text-sm text-muted-foreground">
                {submittedActivities.length} of {activities.length} activities completed
              </div>
              {activities.length === 0 && (
                <div className="text-xs text-muted-foreground mt-2 text-center">
                  No activities assigned yet
                </div>
              )}
            </div>
          }
        />

        <DashboardCard
          title="Upcoming Deadlines"
          content={
            <div className="h-full flex flex-col justify-center">
              {upcomingActivities.length > 0 ? (
                <ul className="space-y-3">
                  {upcomingActivities.map(activity => (
                    <li key={activity.id} className="flex items-center gap-2">
                      <Clock size={16} className="text-muted-foreground" />
                      <div>
                        <div className="font-medium">{activity.title}</div>
                        <div className="text-xs text-muted-foreground">
                          Due: {new Date(activity.deadline || activity.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center text-muted-foreground">
                  {activities.length === 0 ? "No activities yet" : "No upcoming deadlines"}
                </div>
              )}
            </div>
          }
          footer={
            <Link to="/activities" className="w-full">
              <Button variant="outline" className="w-full">
                View All Activities
              </Button>
            </Link>
          }
        />

        <DashboardCard
          title="Recent Submissions"
          content={
            <div className="h-full flex flex-col justify-center">
              {recentSubmissions.length > 0 ? (
                <ul className="space-y-3">
                  {recentSubmissions.map(submission => {
                    const activity = activities.find(a => a.id === submission.activityId);
                    return (
                      <li key={submission.id} className="flex items-center gap-2">
                        <Upload size={16} className="text-muted-foreground" />
                        <div>
                          <div className="font-medium">{activity?.title}</div>
                          <div className="flex items-center text-xs text-muted-foreground gap-2">
                            {new Date(submission.submittedAt).toLocaleDateString()}
                            <Badge variant={submission.status === SubmissionStatus.Reviewed ? "default" : "outline"}>
                              {submission.status}
                            </Badge>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="text-center text-muted-foreground">
                  No submissions yet
                </div>
              )}
            </div>
          }
          footer={
            <Link to="/submissions" className="w-full">
              <Button variant="outline" className="w-full">
                View All Submissions
              </Button>
            </Link>
          }
        />
      </div>

      {/* Attachment Letter Section - Only show if eligible and letter exists */}
      {attachmentLetter && submissionRate === 100 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Attachment Letter</h2>
          <DashboardCard
            title="Your Attachment Letter"
            content={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <File className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="font-medium">{attachmentLetter.fileName}</div>
                    <div className="text-sm text-muted-foreground">
                      Uploaded on {new Date(attachmentLetter.uploadedAt).toLocaleDateString()}
                    </div>
                    <Badge variant="outline" className="mt-1 flex items-center gap-1 w-fit">
                      <CheckCircle className="h-3 w-3" />
                      Ready for Practicum
                    </Badge>
                  </div>
                </div>
                <Button onClick={downloadAttachmentLetter} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            }
          />
        </div>
      )}

      {/* Eligibility Notice - Show if not yet eligible */}
      {submissionRate < 100 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Attachment Letter</h2>
          <DashboardCard
            title="Attachment Letter Eligibility"
            content={
              <div className="text-center py-4">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-medium mb-2">Complete All Activities</h3>
                <p className="text-muted-foreground text-sm">
                  You need to complete all required activities to be eligible for your attachment letter.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Progress: {submittedActivities.length} of {activities.length} activities completed
                </p>
              </div>
            }
          />
        </div>
      )}

      {/* Quick Actions */}
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Link to="/activities" className="w-full">
          <Button variant="outline" className="w-full h-full py-6 flex flex-col gap-2">
            <Calendar className="h-6 w-6" />
            <span>View Activities</span>
          </Button>
        </Link>
        
        <Link to="/submissions" className="w-full">
          <Button variant="outline" className="w-full h-full py-6 flex flex-col gap-2">
            <Upload className="h-6 w-6" />
            <span>My Submissions</span>
          </Button>
        </Link>

        <Link to="/submissions/new" className="w-full">
          <Button className="w-full h-full py-6 flex flex-col gap-2">
            <FileText className="h-6 w-6" />
            <span>New Submission</span>
          </Button>
        </Link>
        
        <Link to="/submissions" className="w-full">
          <Button variant="outline" className="w-full h-full py-6 flex flex-col gap-2">
            <TrendingUp className="h-6 w-6" />
            <span>My Progress</span>
          </Button>
        </Link>
      </div>

      {/* Activity List Preview */}
      <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {activities.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Activity</th>
                    <th className="px-4 py-3 text-left font-medium">Deadline</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.slice(0, 3).map(activity => {
                    const submission = submissions.find(s => s.activityId === activity.id);
                    const isPastDeadline = new Date(activity.deadline || activity.endDate) < new Date();
                    let status = "Not Started";
                    let statusColor = "bg-gray-100 text-gray-800";
                    
                    if (submission) {
                      status = submission.status === SubmissionStatus.Reviewed ? "Reviewed" : "Submitted";
                      statusColor = submission.status === SubmissionStatus.Reviewed 
                        ? "bg-green-100 text-green-800" 
                        : "bg-blue-100 text-blue-800";
                    } else if (isPastDeadline) {
                      status = "Overdue";
                      statusColor = "bg-red-100 text-red-800";
                    }
                    
                    return (
                      <tr key={activity.id} className="border-t">
                        <td className="px-4 py-3">
                          <div className="font-medium">{activity.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {activity.description}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            <span>{new Date(activity.deadline || activity.endDate).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`${statusColor} text-xs px-2 py-1 rounded-full`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link to={`/activities/${activity.id}`}>
                            <Button size="sm">View</Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-center">
              <Link to="/activities">
                <Button variant="link">View All Activities</Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Activities Yet</h3>
            <p className="text-muted-foreground">
              Your instructor hasn't created any activities yet. Check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
