
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { useAuth } from "@/contexts/AuthContext";
import { Activity, Submission, User, UserRole } from "@/types";
import { Calendar, FileText, Plus, Users, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const InstructorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [students, setStudents] = useState<User[]>([]);

  // Mock data fetch
  useEffect(() => {
    // Simulate fetching activities
    const mockActivities: Activity[] = [
      {
        id: "1",
        title: "Week 1: Company Introduction",
        description: "Write a brief introduction about the company you are interning with.",
        deadline: "2025-06-10T23:59:59Z",
        createdAt: "2025-05-01T10:00:00Z",
        createdBy: user?.id || "2"
      },
      {
        id: "2",
        title: "Week 2: Department Overview",
        description: "Describe the department you are working in and its role within the company.",
        deadline: "2025-06-17T23:59:59Z",
        createdAt: "2025-05-01T10:05:00Z",
        createdBy: user?.id || "2"
      },
      {
        id: "3",
        title: "Week 3: Daily Tasks Analysis",
        description: "Document and analyze the daily tasks you are performing.",
        deadline: "2025-06-24T23:59:59Z",
        createdAt: "2025-05-01T10:10:00Z",
        createdBy: user?.id || "2"
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

    // Simulate fetching submissions
    const mockSubmissions: Submission[] = [
      {
        id: "1",
        activityId: "1",
        studentId: "1",
        fileName: "company_intro.pdf",
        fileUrl: "#",
        submittedAt: "2025-06-08T14:30:00Z",
        status: "reviewed"
      },
      {
        id: "2",
        activityId: "1",
        studentId: "4",
        fileName: "company_intro_emma.pdf",
        fileUrl: "#",
        submittedAt: "2025-06-09T10:15:00Z",
        status: "pending"
      },
      {
        id: "3",
        activityId: "2",
        studentId: "5",
        fileName: "department_overview.docx",
        fileUrl: "#",
        submittedAt: "2025-06-15T16:45:00Z",
        status: "pending"
      }
    ];

    setActivities(mockActivities);
    setStudents(mockStudents);
    setSubmissions(mockSubmissions);
  }, [user]);

  // Calculate submission statistics
  const totalSubmissions = submissions.length;
  const pendingSubmissions = submissions.filter(sub => sub.status === "pending").length;
  const reviewedSubmissions = submissions.filter(sub => sub.status === "reviewed").length;
  
  // Calculate activity completion per student
  const activityCompletionPerStudent = students.map(student => {
    const studentSubmissions = submissions.filter(sub => sub.studentId === student.id);
    const completionPercentage = activities.length > 0 
      ? Math.round((studentSubmissions.length / activities.length) * 100)
      : 0;
      
    return {
      student,
      completionPercentage,
      submissionsCount: studentSubmissions.length
    };
  });

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
          <p className="text-muted-foreground">
            Manage practicum activities and monitor student progress
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/activities/create">
            <Button>
              <Plus size={18} className="mr-2" />
              Create New Activity
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <DashboardCard
          title="Total Activities"
          content={
            <div className="flex items-center justify-center h-full">
              <div className="text-4xl font-bold text-primary">{activities.length}</div>
            </div>
          }
        />

        <DashboardCard
          title="Registered Students"
          content={
            <div className="flex items-center justify-center h-full">
              <div className="text-4xl font-bold text-primary">{students.length}</div>
            </div>
          }
        />

        <DashboardCard
          title="Submission Status"
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
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Link to="/activities/manage" className="w-full">
          <Button variant="outline" className="w-full h-full py-6 flex flex-col gap-2">
            <Calendar className="h-6 w-6" />
            <span>Manage Activities</span>
          </Button>
        </Link>
        
        <Link to="/students" className="w-full">
          <Button variant="outline" className="w-full h-full py-6 flex flex-col gap-2">
            <Users className="h-6 w-6" />
            <span>View Students</span>
          </Button>
        </Link>

        <Link to="/submissions/review" className="w-full">
          <Button className="w-full h-full py-6 flex flex-col gap-2">
            <FileText className="h-6 w-6" />
            <span>Review Submissions</span>
          </Button>
        </Link>
        
        <Link to="/activities/create" className="w-full">
          <Button variant="outline" className="w-full h-full py-6 flex flex-col gap-2">
            <Plus className="h-6 w-6" />
            <span>New Activity</span>
          </Button>
        </Link>
      </div>

      {/* Recent Activities */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="w-full lg:w-2/3">
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Activity</th>
                    <th className="px-4 py-3 text-left font-medium">Deadline</th>
                    <th className="px-4 py-3 text-left font-medium">Submissions</th>
                    <th className="px-4 py-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.slice(0, 3).map(activity => {
                    const activitySubmissions = submissions.filter(s => s.activityId === activity.id);
                    const submissionRate = students.length > 0 
                      ? Math.round((activitySubmissions.length / students.length) * 100)
                      : 0;
                    
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
                            <span>{new Date(activity.deadline).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-muted-foreground mb-1">
                            {activitySubmissions.length} of {students.length} students ({submissionRate}%)
                          </div>
                          <Progress value={submissionRate} className="h-2" />
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
              <Link to="/activities/manage">
                <Button variant="link">Manage All Activities</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <h2 className="text-xl font-semibold mb-4">Student Progress</h2>
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 max-h-[320px] overflow-y-auto">
              {activityCompletionPerStudent.map(({ student, completionPercentage, submissionsCount }) => (
                <div key={student.id} className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-medium">{student.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {submissionsCount}/{activities.length}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Progress value={completionPercentage} className="h-2 flex-grow mr-2" />
                    <span className="text-xs font-medium w-8 text-right">
                      {completionPercentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t text-center">
              <Link to="/students">
                <Button variant="link">View All Students</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Submissions */}
      <h2 className="text-xl font-semibold mb-4">Recent Submissions</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Student</th>
                <th className="px-4 py-3 text-left font-medium">Activity</th>
                <th className="px-4 py-3 text-left font-medium">Submitted</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map(submission => {
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
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        submission.status === "reviewed" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {submission.status === "reviewed" ? "Reviewed" : "Pending Review"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/submissions/${submission.id}`}>
                        <Button size="sm" variant={submission.status === "pending" ? "default" : "outline"}>
                          {submission.status === "pending" ? "Review" : "View"}
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-center">
          <Link to="/submissions/review">
            <Button variant="link">View All Submissions</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
