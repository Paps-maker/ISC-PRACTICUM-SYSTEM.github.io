
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import MobileMenuToggle from "./sidebar/MobileMenuToggle";
import NavLinks from "./sidebar/NavLinks";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const { user } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
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

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}

      {isMobile && (
        <MobileMenuToggle 
          isMobileOpen={isMobileOpen} 
          setIsMobileOpen={setIsMobileOpen} 
        />
      )}

      <aside
        className={cn(
          "bg-white border-r transition-all duration-300 ease-in-out shrink-0",
          isMobile
            ? `fixed top-0 left-0 h-full w-72 z-40 transform ${
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : "relative w-72 h-full",
          className
        )}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="text-xl font-bold mb-6 flex items-center justify-center text-center">
            ISC Practicum
          </div>

          <div className="flex-1 overflow-y-auto">
            <NavLinks 
              role={user.role} 
              isMobile={isMobile} 
              closeMobileMenu={closeMobileMenu} 
            />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
