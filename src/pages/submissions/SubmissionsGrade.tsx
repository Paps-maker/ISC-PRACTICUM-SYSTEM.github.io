
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Download, Search, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Activity, Submission, User, UserRole } from "@/types";

const SubmissionsGrade: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [students, setStudents] = useState<User[]>([]);

  // Mock data fetch
  useEffect(() => {
    // Simulate API call to fetch data
    setTimeout(() => {
      // Mock activities
      const mockActivities: Activity[] = [
        {
          id: "1",
          title: "Week 1: Company Introduction",
          description: "Write a brief introduction about the company you are interning with.",
          startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          deadline: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          createdBy: "2"
        },
        {
          id: "2",
          title: "Week 2: Department Overview",
          description: "Describe the department you are working in and its role within the company.",
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now()).toISOString(),
          deadline: new Date(Date.now()).toISOString(),
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          createdBy: "2"
        }
      ];

      // Mock students
      const mockStudents: User[] = [
        {
          id: "1",
          name: "John Student",
          email: "john@example.com",
          role: UserRole.Student
        },
        {
          id: "3",
          name: "Jane Student",
          email: "jane@example.com",
          role: UserRole.Student
        }
      ];

      // Mock submissions
      const mockSubmissions: Submission[] = [
        {
          id: "1",
          activityId: "1",
          studentId: "1",
          fileName: "company_intro.pdf",
          fileUrl: "#",
          submittedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          status: "pending"
        },
        {
          id: "2",
          activityId: "1",
          studentId: "3",
          fileName: "company_intro_jane.pdf",
          fileUrl: "#",
          submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: "pending"
        },
        {
          id: "3",
          activityId: "2",
          studentId: "1",
          fileName: "department_overview.docx",
          fileUrl: "#",
          submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: "pending"
        },
        {
          id: "4",
          activityId: "2",
          studentId: "3",
          fileName: "department_analysis.pdf",
          fileUrl: "#",
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: "reviewed"
        }
      ];

      setActivities(mockActivities);
      setStudents(mockStudents);
      setSubmissions(mockSubmissions);
      setLoading(false);
    }, 1000);
  }, []);

  // Only supervisors should access this page
  useEffect(() => {
    if (user && user.role !== UserRole.Supervisor) {
      toast({
        title: "Access denied",
        description: "Only supervisors can access the grading page.",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [user, navigate, toast]);

  // Filter submissions based on search query
  const filteredSubmissions = submissions.filter(submission => {
    const student = students.find(s => s.id === submission.studentId);
    const activity = activities.find(a => a.id === submission.activityId);
    
    const studentName = student?.name?.toLowerCase() || "";
    const activityTitle = activity?.title?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    
    return studentName.includes(query) || activityTitle.includes(query);
  });

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Grade Submissions</h1>
          <p className="text-muted-foreground">Review and grade student submissions</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Submissions</CardTitle>
          <CardDescription>Filter by student name or activity title</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search submissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 max-w-md"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Submissions</CardTitle>
              <CardDescription>
                {submissions.length} total submissions | {submissions.filter(s => s.status === "pending").length} awaiting review
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map(submission => {
                  const student = students.find(s => s.id === submission.studentId);
                  const activity = activities.find(a => a.id === submission.activityId);
                  
                  return (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">
                        {student?.name}
                        <div className="text-xs text-muted-foreground">{student?.email}</div>
                      </TableCell>
                      <TableCell>
                        {activity?.title}
                        <div className="text-xs text-muted-foreground">
                          Due: {activity ? new Date(activity.deadline || activity.endDate).toLocaleDateString() : "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(submission.submittedAt).toLocaleDateString()}
                        <div className="text-xs text-muted-foreground">
                          {new Date(submission.submittedAt).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-8 p-0">
                          <FileText size={14} className="mr-1" />
                          <span className="text-xs">{submission.fileName}</span>
                          <Download size={14} className="ml-1" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Badge variant={submission.status === "reviewed" ? "outline" : "secondary"}>
                          {submission.status === "reviewed" ? "Reviewed" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/submissions/${submission.id}/grade`}>
                          <Button size="sm">
                            <Star className="h-4 w-4 mr-1" />
                            {submission.status === "reviewed" ? "View" : "Grade"}
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    No submissions found. {searchQuery && "Try adjusting your search query."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionsGrade;
