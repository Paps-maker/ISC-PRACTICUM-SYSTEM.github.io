
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { useNavigate } from "react-router-dom";

interface AccessDeniedProps {
  allowedRoles?: UserRole[];
  message?: string;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ 
  allowedRoles = [], 
  message 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getDashboardUrl = () => {
    if (!user) return "/";
    
    switch (user.role) {
      case UserRole.Student:
        return "/dashboard/student";
      case UserRole.Instructor:
        return "/dashboard/instructor";
      case UserRole.Supervisor:
        return "/dashboard/supervisor";
      default:
        return "/";
    }
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case UserRole.Student:
        return "Students";
      case UserRole.Instructor:
        return "Instructors";
      case UserRole.Supervisor:
        return "Supervisors";
      case UserRole.Admin:
        return "Administrators";
      default:
        return role;
    }
  };

  const defaultMessage = allowedRoles.length > 0 
    ? `This page is only accessible to ${allowedRoles.map(getRoleDisplayName).join(" and ")} users.`
    : "You do not have permission to access this page.";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-amber-200 bg-amber-50 shadow-lg">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="p-4 bg-amber-100 rounded-full">
                <Shield className="h-12 w-12 text-amber-600" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-amber-800">Access Restricted</h1>
                <p className="text-amber-700 text-sm leading-relaxed">
                  {message || defaultMessage}
                </p>
                {user && (
                  <p className="text-amber-600 text-xs">
                    You are currently logged in as: <span className="font-semibold">{getRoleDisplayName(user.role)}</span>
                  </p>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(-1)}
                  className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-100"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>
                <Button 
                  onClick={() => navigate(getDashboardUrl())}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
