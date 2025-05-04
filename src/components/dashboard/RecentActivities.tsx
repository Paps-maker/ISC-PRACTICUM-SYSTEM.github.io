
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Activity, Submission, User } from "@/types";

interface RecentActivitiesProps {
  activities: Activity[];
  submissions: Submission[];
  students: User[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ 
  activities, 
  submissions, 
  students 
}) => {
  return (
    <>
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
                        <span>{new Date(activity.endDate).toLocaleDateString()}</span>
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
    </>
  );
};

export default RecentActivities;
