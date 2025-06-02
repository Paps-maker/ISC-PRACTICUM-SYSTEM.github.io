
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";
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

  const defaultMessage = allowedRoles.length > 0 
    ? `This page is only accessible to ${allowedRoles.join(", ")} users.`
    : "You do not have permission to access this page.";

  return (
    <div className="container mx-auto py-10">
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Shield className="h-16 w-16 text-yellow-600" />
            <h2 className="text-2xl font-bold text-yellow-800">Access Restricted</h2>
            <p className="text-yellow-700 max-w-md">
              {message || defaultMessage}
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              <Button 
                onClick={() => navigate(getDashboardUrl())}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
