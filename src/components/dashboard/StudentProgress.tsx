
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Activity, Submission, User } from "@/types";

interface StudentProgressProps {
  students: User[];
  activities: Activity[];
  submissions: Submission[];
}

const StudentProgress: React.FC<StudentProgressProps> = ({ 
  students, 
  activities, 
  submissions 
}) => {
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
    <>
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
    </>
  );
};

export default StudentProgress;
