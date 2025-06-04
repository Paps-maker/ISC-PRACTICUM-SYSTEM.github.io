import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/ui/back-button";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { useAuth } from "@/contexts/AuthContext";
import { Activity, Evaluation, Submission, User, UserRole, SubmissionStatus } from "@/types";
import { CheckCircle, Download, FileText, Star, Users, Megaphone, Settings } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const SupervisorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [students, setStudents] = useState<User[]>([]);

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

    // Simulate fetching students
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
      },
      {
        id: "6",
        name: "Sophia Williams",
        email: "sophia@example.com",
        role: UserRole.Student
      }
    ];

    // Simulate fetching submissions with correct enum values
    const mockSubmissions: Submission[] = [
      {
        id: "1",
        activityId: "1",
        studentId: "1",
        fileName: "company_intro.pdf",
        fileUrl: "#",
        submittedAt: "2025-06-08T14:30:00Z",
        status: SubmissionStatus.Reviewed
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
      }
    ];

    // Simulate fetching evaluations with correct properties
    const mockEvaluations: Evaluation[] = [
      {
        id: "1",
        submissionId: "1",
        supervisorId: user?.id || "3",
        grade: 85,
        feedback: "Good effort, but needs more specific examples.",
        evaluatedBy: user?.id || "3",
        evaluatedAt: "2025-06-09T11:20:00Z"
      }
    ];

    setActivities(mockActivities);
    setStudents(mockStudents);
    setSubmissions(mockSubmissions);
    setEvaluations(mockEvaluations);
  }, [user]);

  // Calculate statistics
  const totalSubmissions = submissions.length;
  const pendingSubmissions = submissions.filter(sub => sub.status === SubmissionStatus.Pending).length;
  const reviewedSubmissions = submissions.filter(sub => sub.status === SubmissionStatus.Reviewed).length;
  
  // Calculate average grade
  const submissionsWithGrades = submissions.filter(sub => {
    return evaluations.some(evaluation => evaluation.submissionId === sub.id);
  });
  
  const averageGrade = submissionsWithGrades.length > 0
    ? evaluations.reduce((acc, evaluation) => acc + evaluation.grade, 0) / submissionsWithGrades.length
    : 0;

  // Recently graded submissions
  const recentlyGraded = [...evaluations]
    .sort((a, b) => new Date(b.evaluatedAt).getTime() - new Date(a.evaluatedAt).getTime())
    .slice(0, 3);

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <BackButton to="/" label="Back to Home" />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Supervisor Dashboard</h1>
        <p className="text-muted-foreground">
          Track student progress and manage practicum evaluations
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <DashboardCard
          title="Student Overview"
          content={
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-4xl font-bold text-primary mb-2">
                {students.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Registered Students
              </div>
            </div>
          }
        />

        <DashboardCard
          title="Submissions"
          content={
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <div className="grid grid-cols-2 gap-4 w-full text-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{pendingSubmissions}</div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{reviewedSubmissions}</div>
                  <div className="text-xs text-muted-foreground">Reviewed</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {totalSubmissions} total submissions
              </div>
            </div>
          }
        />

        <DashboardCard
          title="Average Grade"
          content={
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-4xl font-bold text-primary mb-2">
                {averageGrade.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">
                From {submissionsWithGrades.length} graded submissions
              </div>
            </div>
          }
        />
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Link to="/students" className="w-full">
          <Button variant="outline" className="w-full h-full py-6 flex flex-col gap-2">
            <Users className="h-6 w-6" />
            <span>View Students</span>
          </Button>
        </Link>
        
        <Link to="/submissions/grade" className="w-full">
          <Button className="w-full h-full py-6 flex flex-col gap-2">
            <Star className="h-6 w-6" />
            <span>Grade Submissions</span>
          </Button>
        </Link>

        <Link to="/activities/manage" className="w-full">
          <Button variant="outline" className="w-full h-full py-6 flex flex-col gap-2">
            <Settings className="h-6 w-6" />
            <span>Manage Activities</span>
          </Button>
        </Link>

        <Link to="/announcements" className="w-full">
          <Button variant="outline" className="w-full h-full py-6 flex flex-col gap-2">
            <Megaphone className="h-6 w-6" />
            <span>Announcements</span>
          </Button>
        </Link>
        
        <Link to="/reports" className="w-full">
          <Button variant="outline" className="w-full h-full py-6 flex flex-col gap-2">
            <CheckCircle className="h-6 w-6" />
            <span>Progress Reports</span>
          </Button>
        </Link>
      </div>

      {/* Pending Submissions */}
      <h2 className="text-xl font-semibold mb-4">Submissions Awaiting Review</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Student</th>
                <th className="px-4 py-3 text-left font-medium">Activity</th>
                <th className="px-4 py-3 text-left font-medium">Submitted</th>
                <th className="px-4 py-3 text-left font-medium">File</th>
                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions
                .filter(sub => sub.status === SubmissionStatus.Pending)
                .map(submission => {
                  const activity = activities.find(a => a.id === submission.activityId);
                  const student = students.find(s => s.id === submission.studentId);
                  
                  return (
                    <tr key={submission.id} className="border-t">
                      <td className="px-4 py-3">
                        <div className="font-medium">{student?.name}</div>
                        <div className="text-xs text-muted-foreground">{student?.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{activity?.title}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          {new Date(submission.submittedAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(submission.submittedAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="ghost" className="h-8 p-0">
                          <Download size={14} className="mr-1" />
                          <span className="text-xs">{submission.fileName}</span>
                        </Button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link to={`/submissions/${submission.id}/grade`}>
                          <Button size="sm">
                            Grade
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                
                {submissions.filter(sub => sub.status === SubmissionStatus.Pending).length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                      No pending submissions to review
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-center">
          <Link to="/submissions/grade">
            <Button variant="link">View All Submissions</Button>
          </Link>
        </div>
      </div>

      {/* Recently Graded */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3">
          <h2 className="text-xl font-semibold mb-4">Recently Graded Submissions</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Student</th>
                    <th className="px-4 py-3 text-left font-medium">Activity</th>
                    <th className="px-4 py-3 text-left font-medium">Grade</th>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentlyGraded.map(evaluation => {
                    const submission = submissions.find(s => s.id === evaluation.submissionId);
                    if (!submission) return null;
                    
                    const activity = activities.find(a => a.id === submission.activityId);
                    const student = students.find(s => s.id === submission.studentId);
                    
                    return (
                      <tr key={evaluation.id} className="border-t">
                        <td className="px-4 py-3">
                          <div className="font-medium">{student?.name}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{activity?.title}</div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={evaluation.grade >= 70 ? "default" : "destructive"}>
                            {evaluation.grade}%
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">
                            {new Date(evaluation.evaluatedAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link to={`/submissions/${submission.id}`}>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                  
                  {recentlyGraded.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                        No graded submissions yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <h2 className="text-xl font-semibold mb-4">Student Progress</h2>
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 max-h-[320px] overflow-y-auto">
              {students.map(student => {
                const studentSubmissions = submissions.filter(sub => sub.studentId === student.id);
                const completionPercentage = activities.length > 0 
                  ? Math.round((studentSubmissions.length / activities.length) * 100)
                  : 0;
                
                // Calculate average grade for this student if they have any
                const studentEvaluations = evaluations.filter(evaluation => {
                  const submission = submissions.find(sub => sub.id === evaluation.submissionId);
                  return submission && submission.studentId === student.id;
                });
                
                const studentAvgGrade = studentEvaluations.length > 0
                  ? studentEvaluations.reduce((acc, evaluation) => acc + evaluation.grade, 0) / studentEvaluations.length
                  : null;
                  
                return (
                  <div key={student.id} className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium">{student.name}</div>
                      <div className="flex items-center">
                        {studentAvgGrade !== null && (
                          <Badge variant={studentAvgGrade >= 70 ? "outline" : "destructive"} className="mr-2">
                            {studentAvgGrade.toFixed(0)}%
                          </Badge>
                        )}
                        <div className="text-sm text-muted-foreground">
                          {studentSubmissions.length}/{activities.length}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Progress value={completionPercentage} className="h-2 flex-grow mr-2" />
                      <span className="text-xs font-medium w-8 text-right">
                        {completionPercentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t text-center">
              <Link to="/students">
                <Button variant="link">View All Students</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
