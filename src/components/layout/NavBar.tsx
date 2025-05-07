
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
        return "/dashboard";
      case UserRole.Instructor:
        return "/instructor/dashboard";
      case UserRole.Supervisor:
        return "/supervisor/dashboard";
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
              <Button variant="outline" onClick={logout} size="sm">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
