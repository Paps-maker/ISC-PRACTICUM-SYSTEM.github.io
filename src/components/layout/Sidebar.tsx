
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  FileText,
  Home,
  Menu,
  Upload,
  Users,
  X
} from "lucide-react";

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  isMobile: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  icon: Icon,
  label,
  isActive,
  isMobile,
  onClick
}) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-foreground hover:bg-muted"
      )}
      onClick={onClick}
    >
      <Icon size={20} />
      {!isMobile && <span>{label}</span>}
    </Link>
  );
};

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMobileMenu = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  if (!user) return null;

  const studentLinks = [
    {
      to: "/dashboard/student",
      icon: Home,
      label: "Dashboard"
    },
    {
      to: "/activities",
      icon: Calendar,
      label: "Activities"
    },
    {
      to: "/submissions",
      icon: Upload,
      label: "My Submissions"
    }
  ];

  const instructorLinks = [
    {
      to: "/dashboard/instructor",
      icon: Home,
      label: "Dashboard"
    },
    {
      to: "/activities/manage",
      icon: Calendar,
      label: "Manage Activities"
    },
    {
      to: "/submissions/review",
      icon: FileText,
      label: "Review Submissions"
    }
  ];

  const supervisorLinks = [
    {
      to: "/dashboard/supervisor",
      icon: Home,
      label: "Dashboard"
    },
    {
      to: "/students",
      icon: Users,
      label: "Students"
    },
    {
      to: "/submissions/grade",
      icon: FileText,
      label: "Grade Submissions"
    }
  ];

  let links;
  switch (user.role) {
    case UserRole.Student:
      links = studentLinks;
      break;
    case UserRole.Instructor:
      links = instructorLinks;
      break;
    case UserRole.Supervisor:
      links = supervisorLinks;
      break;
    default:
      links = [];
  }

  return (
    <>
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <Menu size={20} />
        </Button>
      )}

      <aside
        className={cn(
          "bg-white border-r h-screen transition-all",
          isMobile
            ? `fixed top-0 left-0 w-16 z-40 transform ${
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : "w-64",
          className
        )}
      >
        {isMobile && isMobileOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => setIsMobileOpen(false)}
          >
            <X size={20} />
          </Button>
        )}

        <div className="p-4">
          <div className="text-xl font-bold mb-6 flex items-center justify-center">
            {!isMobile && "ISC Practicum"}
          </div>

          <nav className="space-y-1">
            {links.map((link) => (
              <SidebarLink
                key={link.to}
                to={link.to}
                icon={link.icon}
                label={link.label}
                isActive={location.pathname === link.to}
                isMobile={isMobile}
                onClick={closeMobileMenu}
              />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
