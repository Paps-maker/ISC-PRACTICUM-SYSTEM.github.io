
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

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
      <span>{label}</span>
    </Link>
  );
};

export default SidebarLink;
