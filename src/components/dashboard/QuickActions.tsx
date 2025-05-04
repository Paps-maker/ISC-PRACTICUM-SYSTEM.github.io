
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Plus, Users } from "lucide-react";

const QuickActions: React.FC = () => {
  return (
    <>
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
    </>
  );
};

export default QuickActions;
