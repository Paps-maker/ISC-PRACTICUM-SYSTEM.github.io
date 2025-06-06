import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BackButton } from "@/components/ui/back-button";
import { AccessDenied } from "@/components/ui/access-denied";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Activity, Submission, User, UserRole, SubmissionStatus } from "@/types";
import { FileText, Calendar, Download, Star, Filter, Eye } from "lucide-react";
import { format } from "date-fns";

const SubmissionsGrade: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "reviewed">("pending");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<{submission: Submission, activity: Activity, student: User} | null>(null);

  useEffect(() => {
    setLoading(true);

    // Mock data
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
      }
    ];

    const mockStudents: User[] = [
      {
        id: "1",
        name: "John Student",
        email: "student@example.com",
        role: UserRole.Student
      },
      {
        id: "4",
        name: "Emma Johnson",
        email: "emma@example.com",
        role: UserRole.Student
      },
      {
        id: "5",
        name: "Michael Smith",
        email: "michael@example.com",
        role: UserRole.Student
      }
    ];

    const mockSubmissions: Submission[] = [
      {
        id: "1",
        activityId: "1",
        studentId: "1",
        fileName: "company_intro.pdf",
        fileUrl: "#",
        submittedAt: "2025-06-08T14:30:00Z",
        status: SubmissionStatus.Pending
      },
      {
        id: "2",
        activityId: "1",
        studentId: "4",
        fileName: "company_intro_emma.pdf",
        fileUrl: "#",
        submittedAt: "2025-06-09T10:15:00Z",
        status: SubmissionStatus.Pending
      },
      {
        id: "3",
        activityId: "2",
        studentId: "5",
        fileName: "department_overview.docx",
        fileUrl: "#",
        submittedAt: "2025-06-15T16:45:00Z",
        status: SubmissionStatus.Pending
      },
      {
        id: "4",
        activityId: "1",
        studentId: "1",
        fileName: "previous_submission.pdf",
        fileUrl: "#",
        submittedAt: "2025-06-01T12:00:00Z",
        status: SubmissionStatus.Reviewed,
        grade: 85,
        feedback: "Great work!"
      }
    ];

    setActivities(mockActivities);
    setSubmissions(mockSubmissions);
    setStudents(mockStudents);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = submissions;

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(sub => 
        filterStatus === "pending" ? sub.status === SubmissionStatus.Pending : sub.status === SubmissionStatus.Reviewed
      );
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((submission) => {
        const activity = activities.find((act) => act.id === submission.activityId);
        const student = students.find((stu) => stu.id === submission.studentId);

        return (
          (activity && activity.title.toLowerCase().includes(query)) ||
          (student && student.name.toLowerCase().includes(query)) ||
          submission.fileName.toLowerCase().includes(query)
        );
      });
    }

    setFilteredSubmissions(filtered);
  }, [searchQuery, submissions, activities, students, filterStatus]);

  const handleViewSubmission = (submission: Submission, activity: Activity, student: User) => {
    setSelectedSubmission({ submission, activity, student });
    setViewDialogOpen(true);
  };

  const handleDownloadSubmission = (submission: Submission) => {
    toast({
      title: "Download started",
      description: `Downloading ${submission.fileName}...`,
    });
    // Mock download - in real app would trigger actual file download
    console.log(`Downloading file: ${submission.fileName}`);
  };

  if (user?.role !== UserRole.Supervisor) {
    return <AccessDenied allowedRoles={[UserRole.Supervisor]} />;
  }

  const pendingCount = submissions.filter(sub => sub.status === SubmissionStatus.Pending).length;
  const reviewedCount = submissions.filter(sub => sub.status === SubmissionStatus.Reviewed).length;

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <BackButton to="/dashboard/supervisor" label="Back to Dashboard" />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Star className="h-8 w-8" />
          Grade Submissions
        </h1>
        <p className="text-muted-foreground">
          Review and grade student submissions
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <FileText className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reviewed</p>
                <p className="text-2xl font-bold text-green-600">{reviewedCount}</p>
              </div>
              <Star className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-primary">{submissions.length}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          type="search"
          placeholder="Search by activity, student, or file name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            onClick={() => setFilterStatus("all")}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={filterStatus === "pending" ? "default" : "outline"}
            onClick={() => setFilterStatus("pending")}
            size="sm"
          >
            Pending ({pendingCount})
          </Button>
          <Button
            variant={filterStatus === "reviewed" ? "default" : "outline"}
            onClick={() => setFilterStatus("reviewed")}
            size="sm"
          >
            Reviewed ({reviewedCount})
          </Button>
        </div>
      </div>

      {/* View Submission Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>View Submission: {selectedSubmission?.submission.fileName}</DialogTitle>
            <DialogDescription>
              Submitted by {selectedSubmission?.student.name} for {selectedSubmission?.activity.title}
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
                  you would integrate with document viewers like PDF.js, Google Docs Viewer API, 
                  or Microsoft Office Online.
                </p>
                <p className="text-sm mt-3 text-muted-foreground">
                  File: {selectedSubmission?.submission.fileName}<br/>
                  Submitted: {selectedSubmission?.submission.submittedAt && new Date(selectedSubmission.submission.submittedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Submissions Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Loading submissions...</p>
          </div>
        ) : filteredSubmissions.length > 0 ? (
          filteredSubmissions.map((submission) => {
            const activity = activities.find((act) => act.id === submission.activityId);
            const student = students.find((stu) => stu.id === submission.studentId);

            return (
              <Card key={submission.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{activity?.title}</CardTitle>
                      <CardDescription className="mt-1">
                        Submitted by {student?.name}
                      </CardDescription>
                    </div>
                    <Badge variant={submission.status === SubmissionStatus.Reviewed ? "default" : "secondary"}>
                      {submission.status === SubmissionStatus.Reviewed ? "Reviewed" : "Pending"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{submission.fileName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(submission.submittedAt), "MMM d, yyyy 'at' h:mm a")}
                      </div>
                      {submission.grade && (
                        <Badge variant="outline">
                          Grade: {submission.grade}/100
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {activity && student && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewSubmission(submission, activity, student)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownloadSubmission(submission)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Link to={`/submissions/${submission.id}/grade`}>
                        <Button size="sm">
                          <Star className="h-4 w-4 mr-1" />
                          {submission.status === SubmissionStatus.Reviewed ? "Review" : "Grade"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No submissions found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? `No submissions match "${searchQuery}"` : "No submissions available for the selected filter"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SubmissionsGrade;
