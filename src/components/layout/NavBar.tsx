
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

const NavBar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

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

  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          ISC Practicum
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to={getDashboardUrl()} className="hover:text-white/90">
                Dashboard
              </Link>
              <span className="text-sm opacity-90">
                {user?.name} ({user?.role})
              </span>
              <Button 
                variant="secondary" 
                onClick={logout} 
                size="sm"
                className="bg-white text-primary hover:bg-gray-100"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button 
                  size="sm"
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
