import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { BackButton } from "@/components/ui/back-button";
import { useAuth } from "@/contexts/AuthContext";
import { studentStore } from "@/stores/studentStore";
import { Activity, Submission, User, UserRole, Evaluation, SubmissionStatus } from "@/types";
import { FileBarChart, Download, TrendingUp, Users, CheckCircle, Clock } from "lucide-react";

const ProgressReports: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - in real app this would come from API
  const [activities] = useState<Activity[]>([
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
  ]);

  const [submissions] = useState<Submission[]>([
    {
      id: "1",
      activityId: "1",
      studentId: "1",
      fileName: "company_intro.pdf",
      fileUrl: "#",
      submittedAt: "2025-06-08T14:30:00Z",
      status: SubmissionStatus.Reviewed,
      grade: 85
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
  ]);

  const [evaluations] = useState<Evaluation[]>([
    {
      id: "1",
      submissionId: "1",
      grade: 85,
      feedback: "Good effort, but needs more specific examples.",
      evaluatedBy: user?.id || "3",
      evaluatedAt: "2025-06-09T11:20:00Z"
    }
  ]);

  useEffect(() => {
    setStudents(studentStore.getStudents());
    
    const unsubscribe = studentStore.subscribe(() => {
      setStudents(studentStore.getStudents());
    });
    
    return unsubscribe;
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStudentProgress = (studentId: string) => {
    const studentSubmissions = submissions.filter(sub => sub.studentId === studentId);
    const completionRate = activities.length > 0 ? (studentSubmissions.length / activities.length) * 100 : 0;
    
    // Calculate average grade
    const studentEvaluations = evaluations.filter(evaluation => {
      const submission = submissions.find(sub => sub.id === evaluation.submissionId);
      return submission && submission.studentId === studentId;
    });
    
    const averageGrade = studentEvaluations.length > 0
      ? studentEvaluations.reduce((acc, evaluation) => acc + evaluation.grade, 0) / studentEvaluations.length
      : null;

    return {
      completionRate: Math.round(completionRate),
      submissionsCount: studentSubmissions.length,
      totalActivities: activities.length,
      averageGrade
    };
  };

  // Calculate activity completion statistics
  const getActivityCompletionStats = () => {
    const activityStats = activities.map(activity => {
      const activitySubmissions = submissions.filter(sub => sub.activityId === activity.id);
      const completedSubmissions = activitySubmissions.filter(sub => 
        sub.status === SubmissionStatus.Reviewed || sub.status === SubmissionStatus.Graded
      );
      
      return {
        activity,
        totalStudents: students.length,
        completedCount: completedSubmissions.length,
        remainingCount: students.length - completedSubmissions.length,
        completionPercentage: students.length > 0 ? Math.round((completedSubmissions.length / students.length) * 100) : 0
      };
    });

    const overallCompleted = activityStats.reduce((acc, stat) => acc + stat.completedCount, 0);
    const overallRemaining = activityStats.reduce((acc, stat) => acc + stat.remainingCount, 0);
    const totalPossible = activities.length * students.length;

    return {
      activityStats,
      overallCompleted,
      overallRemaining,
      totalPossible,
      overallCompletionPercentage: totalPossible > 0 ? Math.round((overallCompleted / totalPossible) * 100) : 0
    };
  };

  const handleExportReport = () => {
    // Create CSV content
    const csvContent = [
      ['Student Name', 'Email', 'Completion Rate', 'Submissions Count', 'Total Activities', 'Average Grade'].join(','),
      ...filteredStudents.map(student => {
        const progress = getStudentProgress(student.id);
        return [
          student.name,
          student.email,
          `${progress.completionRate}%`,
          progress.submissionsCount,
          progress.totalActivities,
          progress.averageGrade ? `${progress.averageGrade.toFixed(0)}%` : 'N/A'
        ].join(',');
      })
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `progress_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getDashboardUrl = () => {
    switch (user?.role) {
      case UserRole.Supervisor:
        return "/dashboard/supervisor";
      case UserRole.Instructor:
        return "/dashboard/instructor";
      default:
        return "/";
    }
  };

  // Only allow supervisors and instructors to access progress reports
  if (user?.role !== UserRole.Supervisor && user?.role !== UserRole.Instructor) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-2">You don't have permission to view progress reports.</p>
        </div>
      </div>
    );
  }

  const completionStats = getActivityCompletionStats();

  return (
    <div className="container mx-auto py-10">
      <BackButton to={getDashboardUrl()} label="Back to Dashboard" />
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileBarChart className="h-8 w-8" />
            Progress Reports
          </h1>
          <p className="text-muted-foreground mt-2">
            Track student progress and performance across all activities
          </p>
        </div>
        <Button onClick={handleExportReport}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Overall Activity Completion Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Activity Completion Overview
          </CardTitle>
          <CardDescription>
            Track how many activities have been completed vs remaining across all students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{completionStats.overallCompleted}</div>
              <div className="text-sm text-muted-foreground">Completed Submissions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{completionStats.overallRemaining}</div>
              <div className="text-sm text-muted-foreground">Remaining Submissions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{completionStats.totalPossible}</div>
              <div className="text-sm text-muted-foreground">Total Expected</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{completionStats.overallCompletionPercentage}%</div>
              <div className="text-sm text-muted-foreground">Overall Completion</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Activity Breakdown</h4>
            {completionStats.activityStats.map((stat) => (
              <div key={stat.activity.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium">{stat.activity.title}</h5>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {stat.completedCount} completed
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {stat.remainingCount} remaining
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={stat.completionPercentage} className="flex-grow h-2" />
                  <span className="text-sm font-medium w-12 text-right">
                    {stat.completionPercentage}%
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stat.completedCount} of {stat.totalStudents} students completed
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activities.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.length > 0 ? Math.round(
                students.reduce((acc, student) => acc + getStudentProgress(student.id).completionRate, 0) / students.length
              ) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Students</CardTitle>
          <CardDescription>Filter students by name or email</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Student Progress List */}
      <Card>
        <CardHeader>
          <CardTitle>Student Progress Overview</CardTitle>
          <CardDescription>Individual progress for each student</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {filteredStudents.map((student) => {
                const progress = getStudentProgress(student.id);
                
                return (
                  <div key={student.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {progress.averageGrade !== null && (
                          <Badge variant={progress.averageGrade >= 70 ? "default" : "destructive"}>
                            Avg: {progress.averageGrade.toFixed(0)}%
                          </Badge>
                        )}
                        <Badge variant="outline">
                          {progress.submissionsCount}/{progress.totalActivities} completed
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Completion Progress</span>
                        <span className="font-medium">{progress.completionRate}%</span>
                      </div>
                      <Progress value={progress.completionRate} className="h-2" />
                    </div>
                    
                    <div className="mt-3 flex gap-2">
                      <Link to="/students">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </Link>
                      <Link to="/submissions/grade">
                        <Button size="sm" variant="outline">
                          View Submissions
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
              
              {filteredStudents.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No students found matching your search criteria.
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressReports;
