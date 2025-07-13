
import React from "react";
import { useLocation } from "react-router-dom";
import { Calendar, FileText, Home, Upload, Users, GraduationCap } from "lucide-react";
import { UserRole } from "@/types";
import SidebarLink from "./SidebarLink";

interface NavLinksProps {
  role: UserRole;
  isMobile: boolean;
  closeMobileMenu: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ role, isMobile, closeMobileMenu }) => {
  const location = useLocation();

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
      to: "/students",
      icon: Users,
      label: "View Students"
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
      to: "/activities/manage",
      icon: Calendar,
      label: "Manage Activities"
    },
    {
      to: "/submissions/grade",
      icon: FileText,
      label: "Grade Submissions"
    },
    {
      to: "/letters/attachment",
      icon: GraduationCap,
      label: "Letters"
    }
  ];

  let links;
  switch (role) {
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
    <nav className="space-y-2">
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
  );
};

export default NavLinks;
