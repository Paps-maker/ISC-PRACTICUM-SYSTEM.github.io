
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, Submission, User, SubmissionStatus, UserRole } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

interface RecentSubmissionsProps {
  submissions: Submission[];
  activities: Activity[];
  students: User[];
}

const RecentSubmissions: React.FC<RecentSubmissionsProps> = ({ 
  submissions, 
  activities, 
  students 
}) => {
  const { user } = useAuth();

  return (
    <>
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
                        submission.status === SubmissionStatus.Reviewed 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {submission.status === SubmissionStatus.Reviewed ? "Reviewed" : "Pending Review"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {/* Only show Grade/Review buttons for Supervisors */}
                      {user?.role === UserRole.Supervisor && (
                        <Link to={`/submissions/${submission.id}/grade`}>
                          <Button size="sm" variant={submission.status === SubmissionStatus.Pending ? "default" : "outline"}>
                            {submission.status === SubmissionStatus.Pending ? "Grade" : "View"}
                          </Button>
                        </Link>
                      )}
                      {/* For instructors, just show View button */}
                      {user?.role === UserRole.Instructor && (
                        <Link to={`/submissions/${submission.id}`}>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-center">
          {user?.role === UserRole.Supervisor ? (
            <Link to="/submissions/grade">
              <Button variant="link">View All Submissions</Button>
            </Link>
          ) : (
            <Link to="/submissions/review">
              <Button variant="link">View All Submissions</Button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default RecentSubmissions;
