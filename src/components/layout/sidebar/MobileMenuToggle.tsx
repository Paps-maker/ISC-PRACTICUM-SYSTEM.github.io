
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
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Menu size={18} />
      </Button>
      
      {isMobileOpen && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 z-50 text-foreground hover:bg-gray-100"
          onClick={() => setIsMobileOpen(false)}
        >
          <X size={18} />
        </Button>
      )}
    </>
  );
};

export default MobileMenuToggle;
