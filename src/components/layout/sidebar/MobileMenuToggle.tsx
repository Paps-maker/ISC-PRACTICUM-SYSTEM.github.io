
import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface MobileMenuToggleProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

const MobileMenuToggle: React.FC<MobileMenuToggleProps> = ({ 
  isMobileOpen, 
  setIsMobileOpen 
}) => {
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Menu size={20} />
      </Button>
      
      {isMobileOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={() => setIsMobileOpen(false)}
        >
          <X size={20} />
        </Button>
      )}
    </>
  );
};

export default MobileMenuToggle;
