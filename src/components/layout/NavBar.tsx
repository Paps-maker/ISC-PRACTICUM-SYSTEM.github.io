
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import NotificationBell from "@/components/notifications/NotificationBell";
import { Menu, X } from "lucide-react";

const NavBar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardUrl = () => {
    if (!user) return "/";
    
    switch (user.role) {
      case UserRole.Student:
        return "/dashboard/student";
      case UserRole.Instructor:
        return "/dashboard/instructor";
      case UserRole.Supervisor:
        return "/dashboard/supervisor";
      case UserRole.Admin:
        return "/dashboard/admin";
      default:
        return "/";
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-primary text-primary-foreground shadow-md relative">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl md:text-2xl font-bold" onClick={handleLinkClick}>
            ISC Practicum
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to={getDashboardUrl()} className="hover:text-white/90 text-sm md:text-base">
                  Dashboard
                </Link>
                {user?.role === UserRole.Instructor && (
                  <Link to="/activities/manage" className="hover:text-white/90 text-sm md:text-base">
                    Manage Activities
                  </Link>
                )}
                {user?.role === UserRole.Supervisor && (
                  <>
                    <Link to="/activities/manage" className="hover:text-white/90 text-sm md:text-base">
                      Manage Activities
                    </Link>
                    <Link to="/submissions/grade" className="hover:text-white/90 text-sm md:text-base">
                      Grade Submissions
                    </Link>
                    <Link to="/letters/attachment" className="hover:text-white/90 text-sm md:text-base">
                      Letters
                    </Link>
                  </>
                )}
                <NotificationBell />
                <span className="text-xs md:text-sm opacity-90 hidden xl:block">
                  {user?.name} ({user?.role})
                </span>
                <Button 
                  variant="secondary" 
                  onClick={handleLogout} 
                  size="sm"
                  className="bg-white text-primary hover:bg-gray-100 text-xs md:text-sm"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={handleLinkClick}>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="bg-white text-primary hover:bg-gray-100 text-xs md:text-sm"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={handleLinkClick}>
                  <Button 
                    size="sm"
                    className="bg-white text-primary hover:bg-gray-100 text-xs md:text-sm"
                  >
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            {isAuthenticated && <NotificationBell />}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:bg-white/10"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-primary border-t border-white/20 z-50">
            <div className="container mx-auto px-4 py-4 space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="text-sm opacity-90 border-b border-white/20 pb-2">
                    {user?.name} ({user?.role})
                  </div>
                  <Link 
                    to={getDashboardUrl()} 
                    className="block hover:text-white/90 py-2 text-sm"
                    onClick={handleLinkClick}
                  >
                    Dashboard
                  </Link>
                  {user?.role === UserRole.Instructor && (
                    <Link 
                      to="/activities/manage" 
                      className="block hover:text-white/90 py-2 text-sm"
                      onClick={handleLinkClick}
                    >
                      Manage Activities
                    </Link>
                  )}
                  {user?.role === UserRole.Supervisor && (
                    <>
                      <Link 
                        to="/activities/manage" 
                        className="block hover:text-white/90 py-2 text-sm"
                        onClick={handleLinkClick}
                      >
                        Manage Activities
                      </Link>
                      <Link 
                        to="/submissions/grade" 
                        className="block hover:text-white/90 py-2 text-sm"
                        onClick={handleLinkClick}
                      >
                        Grade Submissions
                      </Link>
                      <Link 
                        to="/letters/attachment" 
                        className="block hover:text-white/90 py-2 text-sm"
                        onClick={handleLinkClick}
                      >
                        Letters
                      </Link>
                    </>
                  )}
                  <Button 
                    variant="secondary" 
                    onClick={handleLogout} 
                    size="sm"
                    className="bg-white text-primary hover:bg-gray-100 w-full mt-3"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" onClick={handleLinkClick} className="block">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      className="bg-white text-primary hover:bg-gray-100 w-full"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={handleLinkClick} className="block">
                    <Button 
                      size="sm"
                      className="bg-white text-primary hover:bg-gray-100 w-full"
                    >
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
