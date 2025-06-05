
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  to, 
  label = "Back", 
  className = "mb-6" 
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleClick = () => {
    // If the label is "Back to Home", log the user out and redirect to home
    if (label === "Back to Home") {
      logout();
      navigate("/");
      return;
    }

    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button 
      variant="ghost" 
      onClick={handleClick}
      className={className}
    >
      <ChevronLeft className="mr-2 h-4 w-4" /> {label}
    </Button>
  );
};
