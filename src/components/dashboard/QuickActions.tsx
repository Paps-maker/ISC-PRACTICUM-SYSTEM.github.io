
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Plus, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

const QuickActions: React.FC = () => {
  const { user } = useAuth();
  
  // Define actions based on user role
  const getActions = () => {
    if (!user) return [];
    
    switch (user.role) {
      case UserRole.Instructor:
        return [
          {
            to: "/activities",
            icon: <Calendar className="h-6 w-6" />,
            label: "Manage Activities"
          },
          {
            to: "/students",
            icon: <Users className="h-6 w-6" />,
            label: "View Students"
          },
          {
            to: "/submissions",
            icon: <FileText className="h-6 w-6" />,
            label: "Review Submissions",
            primary: true
          },
          {
            to: "/activities/create",
            icon: <Plus className="h-6 w-6" />,
            label: "New Activity"
          }
        ];
      case UserRole.Student:
        return [
          {
            to: "/activities",
            icon: <Calendar className="h-6 w-6" />,
            label: "View Activities"
          },
          {
            to: "/submissions",
            icon: <FileText className="h-6 w-6" />,
            label: "My Submissions",
            primary: true
          }
        ];
      case UserRole.Supervisor:
        return [
          {
            to: "/students",
            icon: <Users className="h-6 w-6" />,
            label: "View Students"
          },
          {
            to: "/submissions",
            icon: <FileText className="h-6 w-6" />,
            label: "Grade Submissions",
            primary: true
          },
          {
            to: "/activities",
            icon: <Calendar className="h-6 w-6" />,
            label: "View Activities"
          }
        ];
      default:
        return [];
    }
  };

  const actions = getActions();

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {actions.map((action, index) => (
          <Link to={action.to} className="w-full" key={index}>
            <Button 
              variant={action.primary ? "default" : "outline"} 
              className="w-full h-full py-6 flex flex-col gap-2"
            >
              {action.icon}
              <span>{action.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </>
  );
};

export default QuickActions;
