
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/ui/back-button";
import { useAuth } from "@/contexts/AuthContext";
import { Activity, Submission, User, UserRole, SubmissionStatus } from "@/types";
import { Calendar, FileText, User as UserIcon } from "lucide-react";
import { format } from "date-fns";

const SubmissionList: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // No mock data - use empty arrays
    const mockActivities: Activity[] = [];
    const mockStudents: User[] = [];
    const mockSubmissions: Submission[] = [];

    setActivities(mockActivities);
    setSubmissions(mockSubmissions);
    setStudents(mockStudents);
    setFilteredSubmissions(mockSubmissions);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    // Filter submissions based on search query
    if (searchQuery.trim() === "") {
      setFilteredSubmissions(submissions);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = submissions.filter((submission) => {
        const activity = activities.find((act) => act.id === submission.activityId);
        const student = students.find((stu) => stu.id === submission.studentId);

        return (
          (activity && activity.title.toLowerCase().includes(query)) ||
          (student && student.name.toLowerCase().includes(query))
        );
      });
      setFilteredSubmissions(filtered);
    }
  }, [searchQuery, submissions, activities, students]);

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <BackButton to="/dashboard/supervisor" label="Back to Dashboard" />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Submissions</h1>
        <p className="text-muted-foreground">
          Manage student submissions for practicum activities
        </p>
      </div>

      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search by activity or student..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Loading submissions...</p>
          </div>
        ) : (
          <Table>
            <TableCaption>List of student submissions</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Activity</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission) => {
                  const activity = activities.find((act) => act.id === submission.activityId);
                  const student = students.find((stu) => stu.id === submission.studentId);

                  return (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-muted-foreground" />
                          {activity ? activity.title : "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserIcon size={16} className="text-muted-foreground" />
                          {student ? student.name : "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(submission.submittedAt), "MMMM d, yyyy 'at' h:mm a")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{submission.status}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    {searchQuery ? (
                      <div className="text-muted-foreground">
                        No submissions found matching "{searchQuery}"
                      </div>
                    ) : (
                      <div className="text-muted-foreground">No submissions available</div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default SubmissionList;
