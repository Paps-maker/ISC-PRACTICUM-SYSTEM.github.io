
import React from "react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Activity, Submission, User } from "@/types";

interface SummaryStatsProps {
  activities: Activity[];
  students: User[];
  submissions: Submission[];
}

const SummaryStats: React.FC<SummaryStatsProps> = ({ activities, students, submissions }) => {
  // Calculate submission statistics
  const totalSubmissions = submissions.length;
  const pendingSubmissions = submissions.filter(sub => sub.status === "pending").length;
  const reviewedSubmissions = submissions.filter(sub => sub.status === "reviewed").length;

  return (
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
  );
};

export default SummaryStats;
